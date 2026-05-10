---
title: "12 - Bayesian Networks: Incorporating Decisions"
date: "2026-05-10"
description: "A comprehensive, textbook-style guide to Decision Networks, detailing the Maximum Expected Utility principle, human risk behaviors, and the Value of Perfect Information (VPI)."
---

# Bayesian Networks: Incorporating Decisions

So far, we have studied how to construct Bayesian Networks to represent uncertainty and how to perform exact or approximate inference to calculate posterior probabilities (e.g., $P(\text{Rain} \mid \text{Cloudy})$). 

However, in artificial intelligence, calculating a probability is rarely the end goal. We build intelligent agents so they can **act** in the world. What do we do with the outcome of an inference query? How do we decide whether to take an umbrella when the forecast says rain, or leave it behind? 

To answer this, we must augment our probabilistic models with the concept of **Utility** to create **Decision Networks**.

---

## 1. Utilities and Preferences

In the real world, outcomes are rarely certain. An agent must choose between different actions, each leading to a "lottery"—a situation with multiple possible outcomes, each occurring with some probability.

To make a rational decision, an agent must have **Preferences**. It must be able to assign relative values to different outcomes. We represent these values mathematically as **Utilities**.

### The MEU Principle
According to the foundational axioms of rationality (Ramsey, 1931; von Neumann & Morgenstern, 1944), if an agent's preferences obey basic logical constraints (e.g., transitivity), its behavior can be perfectly described by a utility function $U(s)$ that maps states to real numbers.

A rational agent adheres to the **Maximum Expected Utility (MEU) Principle**:
*An agent should choose the action that maximizes its expected utility, given its current knowledge about the world.*

### Human Utilities and Money
While we often use money to represent value, raw monetary amounts do not perfectly align with human utility. 
If given a lottery $L = [0.5, \$1000; 0.5, \$0]$, the Expected Monetary Value (EMV) is $\$500$. However, if offered a guaranteed $\$400$ instead of the lottery, most humans will take the sure $\$400$. 

This happens because the utility of money is not linear for humans; $U(L) < U(EMV(L))$. 
- **Risk-Averse**: Most people prefer a sure outcome slightly below the EMV to avoid the risk of getting nothing. This behavior is the entire mathematical foundation of the **insurance industry**, where people happily pay a premium to eliminate risk.
- **Risk-Prone**: Conversely, humans tend to become risk-prone when deeply in debt (the "sunken fish swims sideways" phenomenon), preferring high-risk gambles over guaranteed slow losses.

Humans also sometimes violate strict rationality axioms entirely, as demonstrated by the famous **Allais Paradox**, where human preferences change inconsistently based on the phrasing of identical lotteries.

---

## 2. Decision Networks

To implement MEU in an AI agent, we extend standard Bayesian Networks into **Decision Networks** by adding two new types of nodes:

1. **Chance Nodes (Ovals)**: Standard random variables, containing Conditional Probability Tables (CPTs).
2. **Action Nodes (Rectangles)**: Variables representing the choices available to the agent. They cannot have parents, but they act as parents to chance or utility nodes. They behave like observed evidence once a choice is made.
3. **Utility Nodes (Diamonds)**: Variables representing the agent's payoff. They depend on action nodes and chance nodes, and contain a Utility Table mapping every combination of parent states to a real-valued utility score.

### Calculating MEU in a Decision Network
To select the optimal action in a Decision Network, we follow this algorithm:
1. **Instantiate all evidence**: Lock in the values of any chance nodes that have been observed in the real world.
2. For each possible action $a$ available in the Action Node:
   - Temporarily set the Action Node to $a$.
   - **Run Inference**: Calculate the posterior probability distribution for all chance nodes that are parents of the Utility node, given the evidence and action $a$.
   - **Calculate Expected Utility**: 
     $$ EU(a \mid \text{evidence}) = \sum_y P(y \mid \text{evidence}, a) U(y, a) $$
     *(where $y$ iterates over all possible states of the chance node parents of the utility node).*
3. **Choose the action** that yields the highest Expected Utility (the MEU).

*Note: This process effectively forms an Expectimax tree, where action nodes act as MAX nodes, and chance nodes act as CHANCE (expectation) nodes.*

---

## 3. The Value of Information (VPI)

A critical sub-problem in decision making is knowing whether it is worth delaying a decision to gather more evidence. 

Imagine an oil company choosing between drilling in Location A or Location B. They only have the budget to drill one. Both locations have a $50\%$ chance of containing oil worth $\$k$. The Expected Utility of drilling either location is $k/2$.
Before drilling, they could hire a scout to survey the land. How much should they pay the scout? What is the **Value of Perfect Information (VPI)**?

### Defining VPI
VPI measures the expected increase in the MEU if a currently unknown variable $E'$ is revealed to us *before* we have to make our decision.

$$ \text{VPI}(E' \mid e) = \left( \sum_{e'} P(e' \mid e) \text{MEU}(e, e') \right) - \text{MEU}(e) $$

In words: It is the expected MEU of acting *after* learning $E'$ (weighted by how likely each outcome of $E'$ is), minus the MEU of having to act right now with only our current evidence $e$.

In the oil example:
- Current MEU without scout = $k/2$.
- If the scout says "Oil is in A", we drill A, Utility is $k$. (Happens with prob $0.5$)
- If the scout says "Oil is in B", we drill B, Utility is $k$. (Happens with prob $0.5$)
- Expected MEU with scout = $0.5(k) + 0.5(k) = k$.
- Gain in MEU (VPI) = $k - k/2 = \mathbf{k/2}$.
The fair price to pay the scout is exactly $k/2$.

### Properties of VPI
1. **Nonnegative**: Information can never mathematically hurt your MEU. VPI is always $\ge 0$. Even if the information is useless, you can just ignore it and achieve your original MEU.
2. **Nonadditive**: $\text{VPI}(E_1, E_2) \ne \text{VPI}(E_1) + \text{VPI}(E_2)$. Information variables interact. Knowing one might make knowing the second either completely redundant, or exponentially more valuable.
3. **Order-Independent**: The order in which you collect evidence does not change its total value.

### Value of Imperfect Information?
In our formulation, there is no such thing as "imperfect information." If a scout is "noisy" or "sometimes wrong," we simply model that by adding a new chance node `ScoutingReport` which is a noisy child of the true `OilLoc` node. We then calculate $\text{VPI}(\text{ScoutingReport})$, which will naturally be lower than $\text{VPI}(\text{OilLoc})$.

### When is VPI exactly Zero?
If a variable $Z$ is conditionally independent of all the parents of the Utility node given your current evidence, then observing $Z$ will not change your probabilities regarding the utility. Consequently, $\text{VPI}(Z \mid \text{evidence}) = 0$.

---

## Summary

- **Rational Agents** use the Maximum Expected Utility (MEU) principle to choose actions that maximize their expected payoff.
- **Decision Networks** extend Bayesian Networks by adding Action nodes (choices) and Utility nodes (payoffs), allowing agents to compute MEU by running probabilistic inference and summing over utility outcomes.
- **Human preferences** often deviate from raw Expected Monetary Value (EMV) due to non-linear utility curves, explaining behaviors like risk-aversion (insurance) and risk-proneness.
- **Value of Perfect Information (VPI)** mathematically calculates the maximum price an agent should pay to observe a new piece of evidence, based on how much that evidence is expected to increase the agent's MEU.
