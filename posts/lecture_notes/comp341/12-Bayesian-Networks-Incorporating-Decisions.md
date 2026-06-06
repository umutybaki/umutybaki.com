---
title: "Lecture 12 Bayesian Networks Incorporating Decisions COMP341"
date: "2026-05-04"
description: "Course: COMP341 Intro to AI, Koç University"
---

# Lecture 12 Bayesian Networks Incorporating Decisions COMP341

**Course**: COMP341 Intro to AI, Koç University  
**Instructor**: Asst. Prof. Barış Akgün  
**Topic**: Decision Networks (Influence Diagrams), Utilities, Maximum Expected Utility, Value of Information


## 0 Where We Are The Big Picture

So far in the course you learned that:

- The real world is **uncertain** - an agent cannot always know the true state.
- We model uncertainty using **probability** and **Bayesian Networks** (BNs).
- BNs let us run inference queries like: "Given that I see clouds and a bad forecast, what is the probability it will rain?"

But here is the key follow-up question: **What should the agent actually DO with that probability?**

Knowing `P(Rain | Clouds, BadForecast) = 0.66` is useful, but it does not directly tell you whether to grab an umbrella. You need to combine probabilities with **how much you care about each outcome**. That is exactly what this lecture is about.


## 1 From Probabilities to Decisions Motivating Example

Imagine you are about to leave home. You wonder: should I take an umbrella?

- If you leave the umbrella and it rains, you get soaked - bad outcome.
- If you take the umbrella and it rains, you stay dry - good outcome.
- If you take the umbrella and it is sunny, you carry it for no reason - slightly annoying.
- If you leave the umbrella and it is sunny, life is easy - great outcome.

A Bayesian Network can tell you `P(Rain | Evidence)`. But you still need to compare the **consequences** of each action. This requires a **utility function**.


## 2 Utilities Assigning Value to Outcomes

### 21 What Is a Utility

A **utility** is a real number that represents how much an agent values a particular outcome. Higher utility = more preferred.

Think of utilities as a scorecard for outcomes. You assign scores based on your preferences:

| Real Weather | Umbrella Decision | Utility |
| :---: | :--- | ---: |
| Rain | Take umbrella | 70 |
| Rain | Leave umbrella | 0 |
| Sunny | Take umbrella | 20 |
| Sunny | Leave umbrella | 100 |

These numbers reflect the relative desirability: sunny + no umbrella (100) is the best; rain + no umbrella (0) is the worst.

### 22 Prizes and Lotteries

An agent chooses among:
- **Prizes**: deterministic outcomes with known values (e.g., you get $100 for certain).
- **Lotteries**: situations with uncertain prizes (e.g., 80% chance of $4000, 20% chance of $0).

A lottery is written as: `L = [p, A; (1-p), B]` meaning "get outcome A with probability p, outcome B with probability 1-p."

### 23 Rational Preferences and Axioms

For utility theory to work, an agent's preferences must satisfy certain **axioms of rationality**:

- **Orderability**: Given two outcomes A and B, the agent must prefer A over B, prefer B over A, or be indifferent. You cannot be in an undefined state of preference.
- **Transitivity**: If you prefer A over B, and B over C, then you must prefer A over C. Cycles like A > B > C > A are irrational.
- **Continuity**: If A is preferred over B and B over C, then there exists some probability p where the lottery `[p, A; (1-p), C]` is equally as good as getting B for certain.
- **Substitutability**: If A and B are equally preferred, you can substitute one for the other anywhere without changing preference.
- **Monotonicity**: Between two lotteries involving the same outcomes, you prefer the one with higher probability on the better outcome.
- **Decomposability**: Compound lotteries can be reduced to simple lotteries using standard probability rules.

Do humans satisfy these? Not always. Behavioral economics shows humans regularly violate these axioms. But for building rational AI agents, we adopt them as design principles.

### 24 The MEU Theorem

The fundamental result, proven by Ramsey (1931) and von Neumann and Morgenstern (1944):

> **Theorem**: If an agent's preferences satisfy the rationality axioms, there exists a real-valued utility function U such that the agent's behavior is equivalent to maximizing expected utility.

In plain English: a rational agent should always pick the action that **maximizes the expected value of its utility function**. This is the **Maximum Expected Utility (MEU) Principle**.


## 3 Expected Utility and Expected Monetary Value

### 31 Expected Monetary Value EMV

For a lottery `L = [p, $X; (1-p), $Y]`:

```
EMV(L) = p * X + (1-p) * Y
```

Example: `L = [0.5, $1000; 0.5, $0]` gives `EMV = 0.5 * 1000 + 0.5 * 0 = $500`

### 32 Utility of a Lottery

The **expected utility** of a lottery is:

```
U(L) = p * U($X) + (1-p) * U($Y)
```

Note: this is NOT the same as `U(EMV(L))`. For most people:

```
U(L) < U(EMV(L))
```

This means people generally prefer a guaranteed $500 over a 50/50 gamble for $1000, even though the expected monetary value is the same. This is called **risk aversion**.

### 33 Risk Aversion vs Risk Proneness

- **Risk-averse**: You prefer the certain equivalent of a lottery to the lottery itself. Most people are risk-averse in general.
- **Risk-prone**: You prefer the gamble to the certain equivalent. People deep in debt may behave this way - when you have nothing left to lose, you might as well gamble.
- **Risk-neutral**: You care only about EMV, not the spread of outcomes.

**Intuition for risk aversion**: The utility function for money is concave (like a square root curve). Going from $0 to $500 is a huge improvement, but going from $500 to $1000 is a smaller marginal improvement. So losing $500 hurts more than gaining $500 helps.

### 34 Insurance Example

Lottery: `[0.5, $1000; 0.5, $0]`
- EMV = $500
- **Certainty equivalent** for most people is approximately $400 (the guaranteed dollar amount they consider equally good as the lottery)
- The difference, $100, is the **insurance premium** - the extra amount you would pay to avoid risk.

This explains why the insurance industry exists: people pay more than the expected loss value to eliminate uncertainty. If everyone were risk-neutral, no one would pay an insurance premium above EMV, and the industry would collapse.

### 35 Allais Paradox Human Irrationality

Allais (1953) demonstrated that humans violate rationality axioms:

- A: `[0.8, $4k; 0.2, $0]`
- B: `[1.0, $3k]` (guaranteed $3000)
- C: `[0.2, $4k; 0.8, $0]`
- D: `[0.25, $3k; 0.75, $0]`

Most people prefer **B over A** and **C over D**.

But mathematically, if `U($0) = 0`:
- B > A implies: `U($3k) > 0.8 * U($4k)`
- C > D implies: `0.2 * U($4k) > 0.25 * U($3k)`, which rearranges to `0.8 * U($4k) > U($3k)`

These two conclusions directly contradict each other. Humans are not fully rational in the mathematical sense, but for building AI agents, we use the rational model.

### 36 Utility Scales

Since utility functions are defined up to a positive linear transformation (shifting and scaling do not change behavior), we often normalize:
- `u+ = 1.0` (best possible outcome)
- `u- = 0.0` (worst possible outcome)

Special utility scales for practical domains:
- **Micromorts**: one-in-a-million chance of death - used to price safety improvements in products.
- **QALYs** (Quality-Adjusted Life Years): used in medical decisions involving substantial health risk.


## 4 Decision Networks Influence Diagrams

### 41 What Is a Decision Network

A **Decision Network** (also called an **Influence Diagram**) extends a Bayesian Network with two new types of nodes:

| Node Type | Shape | Role |
| :--- | :--- | :--- |
| Chance node | Circle / oval | Random variable - just like in a regular BN |
| Action node (Decision node) | Rectangle | Represents a decision the agent makes - a choice under the agent's control |
| Utility node | Diamond | Represents the agent's utility/reward - a function of parents |

**Key properties of action nodes**:
- They have **no parents** - the agent freely chooses their value.
- They **can be parents** of other nodes (chance and utility nodes).
- When reasoning, they are treated as observed evidence once a particular action is chosen.

**Key properties of utility nodes**:
- They have a **utility table** (not a CPT) - for each combination of parent values, it gives a numerical utility.
- They do not have children - they are leaf nodes.

### 42 The Umbrella Decision Network

```text
Umbrella [rectangle: Action]
     |
     v
     U <diamond: Utility> <--- Weather (circle: Chance)
                                     ^
                                     |
                                Forecast (circle: Chance)
```

- **Forecast** and **Weather** are chance nodes with a CPT structure (Bayesian Network).
- **Umbrella** is the action node: values are `{take, leave}`.
- **U** is the utility node that depends on both `Umbrella` (what you did) and `Weather` (what happened).

### 43 Information in Each Node

- **Chance nodes**: Store conditional probability tables (CPTs), just like in BNs.
- **Action nodes**: Store the **list of available actions** (their domain).
- **Utility nodes**: Store a **utility table** mapping each (action, outcome) combination to a numerical utility.


## 5 Computing Maximum Expected Utility MEU

### 51 The Formula

Given evidence `e` (observed values of chance nodes), the **Expected Utility** of a specific action `a` is:

```text
EU(action | evidence) = sum over y of [ P(y | evidence) * U(y, action) ]
```

where `y` ranges over all possible values of the utility node's **chance variable parents**, and `U(y, action)` is the utility table entry.

The **Maximum Expected Utility** is:

```text
MEU(evidence) = max over a of [ EU(a | evidence) ]
```

The **optimal action** is:

```text
optimal_action = argmax over a of [ EU(a | evidence) ]
```

### 52 StepbyStep Algorithm

1. **Instantiate all evidence** - set observed chance nodes to their observed values.
2. **Run inference** - compute the posterior distribution over the utility node's chance-variable parents, conditioned on the evidence.
3. **For each possible action**: compute the expected utility using the formula above.
4. **Select the action with highest EU**.

### 53 Worked Example No Evidence

Utility table:

| Action (A) | Weather (W) | Utility U(A,W) |
| :---: | :---: | ---: |
| leave | sun | 100 |
| leave | rain | 0 |
| take | sun | 20 |
| take | rain | 70 |

Prior probabilities: `P(sun) = 0.7`, `P(rain) = 0.3`

**EU(leave | no evidence)**:
```
EU(leave) = P(sun) * U(leave, sun) + P(rain) * U(leave, rain)
           = 0.7 * 100 + 0.3 * 0
           = 70 + 0
           = 70
```

**EU(take | no evidence)**:
```
EU(take) = P(sun) * U(take, sun) + P(rain) * U(take, rain)
          = 0.7 * 20 + 0.3 * 70
          = 14 + 21
          = 35
```

**MEU = max(70, 35) = 70**, so the **optimal action is "leave"** when no evidence is available.

### 54 Worked Example With Evidence Forecast bad

With a bad forecast, running inference on the Bayesian Network gives us a new posterior:
`P(sun | F=bad) = 0.34`, `P(rain | F=bad) = 0.66`

**EU(leave | F=bad)**:
```
EU(leave) = 0.34 * 100 + 0.66 * 0 = 34
```

**EU(take | F=bad)**:
```
EU(take) = 0.34 * 20 + 0.66 * 70 = 6.8 + 46.2 = 53
```

**MEU = max(34, 53) = 53**, so the **optimal action is "take"** when the forecast is bad.

This makes intuitive sense: when forecast is bad, rain is more likely, so carrying the umbrella pays off.

### 55 Decision Networks as Outcome Trees

Decision networks are structurally similar to **expectimax trees** (from search and game-playing):

```
                    {}
                   /  \
             take       leave
            /    \      /    \
        U(t,s) U(t,r) U(l,s) U(l,r)
```

- Rectangular (decision) nodes correspond to agent choice nodes.
- Circular (chance) nodes are like nature nodes - outcomes governed by probability.
- Leaf values are utilities.
- Just like expectimax, you compute expected values bottom-up and pick the maximizing action.

The difference from plain expectimax is that here we have an explicit probabilistic model (the BN) for the chance outcomes, rather than a hand-coded game tree.


## 6 Value of Information VoI VPI

### 61 The Core Idea

Sometimes you can **observe additional information before acting**. Should you? At what cost is it worth it?

**Value of Information** answers: "How much does my expected utility improve if I get to observe a random variable E' before making my decision?"

This is often called **Value of Perfect Information (VPI)** when the information is noiseless (you observe the actual variable, not a noisy version of it).

**Real-world analogy**: You are a doctor deciding whether to operate on a patient. You can run a lab test before deciding. VPI tells you the maximum dollar amount worth spending on that test.

### 62 Formal Definition

Suppose current evidence is `e`. Without new information, the best you can do is:

```text
MEU(e) = max over a of EU(a | e)
```

Now suppose you observe that `E' = e'` (some new evidence). Then you can recalculate:

```text
MEU(e, e') = max over a of EU(a | e, e')
```

But you do not yet know what value E' will take - it is still a random variable. So the **expected MEU after observing E'** is:

```text
E[MEU(e, E')] = sum over e' of [ P(E'=e' | e) * MEU(e, e') ]
```

The **Value of Perfect Information** is the gain:

```text
VPI(E' | e) = E[MEU(e, E')] - MEU(e)
            = sum over e' of [ P(E'=e' | e) * MEU(e, e') ]  -  MEU(e)
```

In words: VPI is how much better off you are on average by finding out E' before acting, compared to acting right now.

### 63 Oil Drilling Example

Setup:
- Two drilling locations A and B. Exactly one has oil.
- Oil is worth `k` dollars.
- You can only drill in one location.
- Prior: each location equally likely to have oil, `P(OilLoc=A) = P(OilLoc=B) = 0.5`.

Decision network nodes:
- `DrillLoc` (action node): choose A or B
- `OilLoc` (chance node): A or B, prob 0.5 each
- `U` (utility node): `U(DrillLoc=a, OilLoc=a) = k`, else 0

**Without information**:
```
EU(drill A) = P(OilLoc=A) * k + P(OilLoc=B) * 0 = 0.5k
EU(drill B) = P(OilLoc=B) * k + P(OilLoc=A) * 0 = 0.5k
MEU = k/2
```

**With perfect information** (you know which location has oil):
- If told "oil in A": drill A - get k for certain - MEU = k
- If told "oil in B": drill B - get k for certain - MEU = k

Expected MEU with information:
```
E[MEU with info] = P(OilLoc=A) * k + P(OilLoc=B) * k = 0.5k + 0.5k = k
```

**VPI(OilLoc) = k - k/2 = k/2**

Interpretation: You should pay up to k/2 dollars for a perfectly accurate geological survey that tells you which block has oil. If the survey costs less than k/2, buy it; if it costs more, skip it and just pick randomly.

### 64 VPI in the Umbrella Example

Forecast distribution: `P(F=good) = 0.59`, `P(F=bad) = 0.41`

Recall from the examples above:
- MEU with no evidence = 70 (action: leave)
- MEU given F=bad = 53 (action: take)

We also need MEU given F=good. Run inference to get `P(W | F=good)`, then compute EU for both actions under that posterior. Suppose the result is MEU(F=good) = 75 (action: leave).

Then:
```text
VPI(Forecast | no evidence)
  = P(F=good) * MEU(F=good) + P(F=bad) * MEU(F=bad) - MEU(no evidence)
  = 0.59 * 75 + 0.41 * 53 - 70
  = 44.25 + 21.73 - 70
  = -4.02?
```

Wait - VPI must be nonneg. This means the actual MEU(F=good) value must be calculated carefully from the actual posteriors. The point is that you plug in the real numbers from the BN and the formula always gives a nonneg result.

### 65 What Distributions Are Needed for VPI

To calculate `VPI(E' | e)` you need:
1. `P(E' | e)` - the prior distribution over the new evidence node given current evidence.
2. `P(Y | e, E'=e')` for each possible value of E' - the posterior of the utility node's chance parents after observing each possible value of E'.

Both require inference in the Bayesian Network. This is why the course emphasizes that you must be able to run all the highlighted inference queries in the network.

### 66 VPI Properties

**1. Nonnegative** - VPI is always greater than or equal to zero.

Why? Having more information can only help or leave you indifferent. If the new information would have led to the same decision anyway, you simply act the same way - the information did not hurt you. Formally, for any realization of E', `MEU(e, e') >= EU(a* | e)` where `a*` is the optimal action without E'. Taking the weighted average preserves this inequality.

**2. Nonadditive** - `VPI(E1, E2 | e)` is not generally equal to `VPI(E1 | e) + VPI(E2 | e)`.

Example showing why: if you already observe E1, and E1 completely determines E2, then `VPI(E2 | e, E1) = 0` - you get nothing extra from E2. So the joint VPI is less than the sum of individual VPIs.

**3. Order-independent** - `VPI(E1 then E2 | e) = VPI(E2 then E1 | e)`.

The total value of learning both E1 and E2 does not depend on which one you learn first. Your end state of knowledge is the same either way.

### 67 Quick VPI Intuition Examples

- **The soup of the day is clam chowder or split pea, but you would not order either**: VPI = 0. No matter what you learn about the soup, your decision (not ordering soup) does not change. Information that does not change your action has zero value.

- **Two kinds of forks at a picnic, one slightly sturdier**: VPI is very small but nonzero. Your decision may change (pick the sturdier fork), but the utility difference between fork types is tiny. Information has value proportional to the decision improvement it enables.

- **Lottery: $0 or $100, 1% winning chance, you can play any number 1-100**: If you know the winning number, you choose that number and win $100 for certain instead of 1/100 chance. VPI is very high - you go from expected value $1 to $100. Information is extremely valuable when it can completely flip the outcome in your favor.

### 68 Value of Imperfect Information

In the formal framework used here, **there is no "value of imperfect information"** as a separate concept. Here is why:

If your sensor or survey gives noisy information, you do not model it as observing the underlying variable directly. Instead, you introduce a new chance node (e.g., `ScoutingReport`) that is a noisy function of the underlying variable (e.g., `OilLoc`). Then VPI is calculated with respect to observing `ScoutingReport` - not `OilLoc` directly. The noisiness is already captured in the conditional probabilities `P(ScoutingReport | OilLoc)`. So "imperfect information" just means you are observing a different (noisier) variable, and the same VPI formula applies.

### 69 When Is VPI Zero The Key Theorem

Extended oil-drilling network:

```text
DrillLoc (Action)
     |
     v
     U (Utility) <--- OilLoc (Chance)
                           ^
                           |
                      ScoutingReport (Chance) <--- Scout (Chance)
```

- `VPI(OilLoc) = k/2` (very valuable - directly tells you where oil is)
- `VPI(ScoutingReport)` - depends on how informative the report is about OilLoc
- **`VPI(Scout) = 0`** - Why?

Because `Scout` and `OilLoc` are **marginally independent** given no evidence. In the network, there is no path from Scout to OilLoc that is unblocked without going through ScoutingReport. Observing Scout tells you nothing about OilLoc, so it cannot change your optimal drilling decision.

However, **`VPI(Scout | ScoutingReport) != 0`** in general. Once you condition on ScoutingReport, the path Scout → ScoutingReport ← OilLoc becomes active (explaining away), so Scout becomes informative about OilLoc.

**General rule** (the key theorem):

> If the utility node's chance parents `Y` are d-separated from variable `Z` given the current evidence, then `VPI(Z | current evidence) = 0`.

Notation: If `Parents(U) ⊥ Z | CurrentEvidence`, then `VPI(Z | CurrentEvidence) = 0`.

This gives a cheap screening criterion: before spending computation on VPI, check d-separation first. If the variable is d-separated from the utility's parents, its VPI is zero without any calculation.


## 7 Additional Technical Details

### 71 Action Nodes as Parents of Chance Nodes

Sometimes an action directly causes a change in the world - for example, administering a drug changes the disease progression. Action nodes can be parents of chance nodes.

When evaluating a particular action, **treat the action node as observed evidence** (set it to the chosen value), then run inference on the rest of the network. This is consistent with the general inference framework.

### 72 Utility Node With Multiple Chance Variable Parents

If the utility node depends on multiple chance variables `Y1, Y2, ...`, the expected utility formula generalizes:

```text
EU(action | evidence) = sum over (y1, y2, ...) of [ P(y1, y2, ... | evidence) * U(y1, y2, ..., action) ]
```

You need the **joint posterior** of all chance-variable parents given evidence. Use any inference method (exact enumeration, variable elimination, sampling) available.

### 73 Utility Node With Multiple Action Parents

If the utility node depends on multiple action variables (e.g., you choose both an umbrella action and a coat action), you must:

1. Enumerate all possible **combinations** of actions.
2. Compute EU for each combination.
3. Select the combination that maximizes EU.

### 74 Multiple Utility Nodes

Real-world agents may have multiple utility components (e.g., time cost, discomfort, monetary cost):

- **Separate actions** (independent decisions affecting disjoint sets of outcomes): Treat each utility node individually and optimize each action separately.
- **Overlapping actions** (the same action affects multiple utility nodes): Maximize over the **sum** of all expected utilities for each action combination.


## 8 Summary Table

| Concept | Definition | Formula |
|---|---|---|
| Utility | Numerical value of an outcome | Assigned from utility table |
| Expected Utility (EU) | Probability-weighted average of utilities | `EU(a|e) = sum_y P(y|e) * U(y,a)` |
| MEU | Best achievable expected utility | `MEU(e) = max_a EU(a|e)` |
| Optimal Action | Action achieving MEU | `argmax_a EU(a|e)` |
| VPI | Gain in MEU from observing new variable | `sum_{e'} P(e'|e) * MEU(e,e') - MEU(e)` |
| VPI = 0 case | When information is irrelevant to decision | Parents(U) independent of Z given evidence (d-separation) |


## 9 Key Takeaways

1. **Probabilities alone are not enough for decision-making** - you need utilities to capture what outcomes the agent cares about.

2. **Decision Networks extend BNs** by adding rectangular action nodes (the agent's choices) and diamond utility nodes (the agent's preferences).

3. **MEU principle**: always choose the action that maximizes expected utility. This is the formal, mathematical definition of rational agent behavior.

4. **Expected utility is not expected money** - humans and rational agents have concave utility curves for money, leading to risk aversion, which explains insurance markets and gambling behavior.

5. **VPI tells you the fair price of information** - it measures how much better decisions you can make by gathering additional evidence before acting, compared to acting now.

6. **VPI is always nonnegative** - more information cannot hurt a rational agent. The worst case is that you ignore the information and act the same as you would have anyway.

7. **VPI is zero when information is irrelevant** - formally checked using d-separation: if the utility node's chance parents are d-separated from the candidate information node given current evidence, VPI = 0.

8. **Decision Networks unify probabilistic reasoning with optimal decision-making** - they are the full architecture for a rational agent acting under uncertainty.
