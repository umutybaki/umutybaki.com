---
title: 2 - The Elevator Saga - Lecture Notes
date: 2026-05-21
description: Lecture notes on The Elevator Saga - public-goods provision, the free-rider problem, the Samuelson condition, cost-sharing rules, and the pivot (Clarke-Groves) mechanism for honest preference revelation.
---

# 2 - The Elevator Saga - Lecture Notes

## Case Snapshot

A Budapest building has three identical towers (A, B, C). Each tower has **24 two-bedroom apartments** over **6 floors - 4 apartments per floor**. A homeowners' association (HOA), led by president Nick Varga, must decide whether to install an **elevator in Tower A** costing **EUR 72,000**, and how to split the bill.

Key facts:

- Each homeowner **knows their own value** for the elevator but **not** what others value it at.
- Values differ sharply by floor. A study found an elevator raises a unit's property value by about **EUR 1,500**. Second-floor residents might pay a little above that; some elderly sixth-floor residents would pay up to **EUR 10,000**. A ground-floor resident might even **dislike** it (noise) and value it negatively.
- The HOA must answer **two** questions: (1) **should the elevator be built?** and (2) **how is the EUR 72,000 split?**

The deep problem is **preference revelation**: any sensible decision needs to know the true total value, but individuals have an incentive to misreport. This case is the public-economics classic on **how to provide a public good and get people to tell the truth**.

## The Economics of Public Goods

A **public good** has two properties:

- **Non-rival**: one person's use does not reduce the amount available to others. Once the elevator exists, one resident riding it does not stop another from riding it.
- **Non-excludable**: it is hard or undesirable to stop any member of the group from using it. Within the building, every homeowner can use the elevator once it is built.

The elevator is best treated as a **local (club) public good**: for the 24 homeowners of Tower A it is collectively provided and shared. It is **provided once, for everyone, or not at all** - that is the feature that matters.

Why markets under-provide public goods: the **free-rider problem**. Because you benefit whether or not you pay, each person is tempted to **understate** their willingness to pay and let others foot the bill. If everyone does this, the good is not provided even when it should be.

## The Efficiency Rule - the Samuelson Condition

For a **private good**, the efficient rule is individual: provide a unit to a person whenever **that person's value is at least the price**.

For a **public good**, the efficient rule sums across people. The general **Samuelson condition** is:

$$\sum_i MRS_i = MRT$$

- the **sum** of everyone's marginal rates of substitution (their marginal willingness to pay) must equal the marginal rate of transformation (the marginal cost). The intuition: because everyone consumes the same unit at once, society's marginal benefit is the *sum* of individual marginal benefits.

For a one-off **discrete project** like the elevator, the Samuelson condition becomes a simple total-value test:

```text
Build the elevator  if and only if   sum of all individual values  >=  total cost
                                      (sum of v_i)                  >=  EUR 72,000
```

This is the benchmark every decision rule in the case is judged against. The hard part is that the planner does not observe the true values - it must design a rule that makes people reveal them.

## The Preference-Revelation Problem

Each homeowner knows their own value v but not others'. This creates the temptation to misreport:

- **Understating** to pay less: the case's example - a homeowner values the elevator at v = EUR 7,000 but pledges only b = EUR 3,500, hoping it passes anyway while paying little.
- **Overstating** to tip a wanted project over the line.

A good mechanism must make **honest reporting the smart choice** regardless of these temptations.

## Cost-Sharing Rules

Before deciding *whether* to build, the HOA debated *how to split* the EUR 72,000. Three rules appear.

### The Pro Rata and Usage-Based Splits

- **Pro rata (equal split)**: EUR 72,000 / 24 = **EUR 3,000 per apartment**. Simple, but ignores that higher floors benefit more.
- **Usage-based (segment) split**: divide the cost by the 6 floor-segments the elevator traverses: EUR 72,000 / 6 = EUR 12,000 per segment. Each segment's EUR 12,000 is split among the homeowners who use it.

```text
Segment (floors)   Users   Cost of segment   Charge per user
ground -> 1         24       EUR 12,000        12,000/24 = 500
   1   -> 2         20       EUR 12,000        12,000/20 = 600
   2   -> 3         16       EUR 12,000        12,000/16 = 750
   3   -> 4         12       EUR 12,000        12,000/12 = 1,000
   4   -> 5          8       EUR 12,000        12,000/8  = 1,500
   5   -> 6          4       EUR 12,000        12,000/4  = 3,000
A resident on floor n pays the sum of the charges for segments 1..n.
```

### The Fair Share Table

The HOA settled on the **fair share** = the **average of the pro rata and usage-based amounts** for each floor:

| Floor | Homeowners | Pro rata (EUR) | Usage-based (EUR) | Fair share (EUR) |
| :---: | ---: | ---: | ---: | ---: |
| 1 | 4 | 3,000 | 500 | 1,750 |
| 2 | 4 | 3,000 | 1,100 | 2,050 |
| 3 | 4 | 3,000 | 1,850 | 2,425 |
| 4 | 4 | 3,000 | 2,850 | 2,925 |
| 5 | 4 | 3,000 | 4,350 | 3,675 |
| 6 | 4 | 3,000 | 7,350 | 5,175 |
| Total | 24 | 72,000 | 72,000 | 72,000 |

The crucial design point for what follows: the **fair share f(i) is fixed in advance** and does **not depend on anyone's pledge**. It is just an agreed way to divide the cost.

## Ways to Decide Whether to Build - and Why They Fail

| Decision rule | How it works | Why it is flawed |
| :--- | :--- | :--- |
| HOA committee decides | The elected committee votes; if yes, everyone pays the fair share | Paternalistic; ignores individual preferences; "smacks of communist" top-down rule |
| Majority vote | Build if a majority of homeowners vote yes | Ignores **intensity of preference** - a majority of mildly-opposed residents can block an elevator a few residents desperately want, even when total value exceeds cost |
| Pledge / subscription | Build if the sum of pledges reaches EUR 72,000; each pays their pledge | Invites **free-riding**: understate your pledge to pay less and ride on others |
| Pivot mechanism | Pledges decide the outcome; payment is the fixed fair share plus a penalty if you are pivotal | Honest pledging becomes optimal - see below |

The majority-vote flaw is Anna Horvath's point in the case: voting counts heads, not how much each head cares. A rule that respects **intensity** is needed - and that is what the pivot mechanism delivers.

## The Pivot Mechanism - Clarke-Groves / VCG

The **pivot mechanism** (also called the **Clarke-Groves** mechanism or the **Vickrey-Clarke-Groves / VCG** mechanism) is the central theory of this case. It is designed so that **honesty is the best strategy** for revealing how much you value a public good.

Setup:

- Each homeowner i submits a **pledge b(i)** - intended to be their true value.
- Each homeowner has a **fair share f(i)** - fixed in advance, independent of pledges (the table above).
- Let **B = sum of all pledges**.
- **Decision rule**: build the elevator **if B is at least EUR 72,000**.

Two design twists make honesty pay:

1. **You pay your fair share f(i), not your pledge.** Your pledge can never raise your own bill. This kills the incentive to lowball.
2. **If you are *pivotal* - your pledge changed the outcome - you pay an extra penalty** (a "Clarke tax") equal to the cost you imposed on everyone else.

### The Pivotal Test

You are **pivotal** if the decision would have been different had your pledge b(i) been replaced by your fair share f(i). Concretely, compare:

- the actual total **B**, and
- the hypothetical total **B − b(i) + f(i)**.

If both are on the **same side** of EUR 72,000, your pledge did not change anything - **not pivotal**. If they are on **opposite sides**, your pledge flipped the decision - **pivotal**, and you pay a penalty.

Define two helper quantities:

```text
B_other = B - b(i)            (the sum of everyone else's pledges)
F_other = 72,000 - f(i)       (the cost everyone else is responsible for)

Penalty (only if pivotal) = | B_other - F_other |
```

### The Four Cases

```text
CASE A: B >= 72,000  -> elevator IS approved
  1. B - b(i) + f(i) >= 72,000 : would pass anyway -> NOT pivotal
        Payment = f(i)
  2. B - b(i) + f(i) <  72,000 : your high pledge made it pass -> PIVOTAL
        Payment = f(i) + (F_other - B_other)

CASE B: B < 72,000  -> elevator is NOT approved
  3. B - b(i) + f(i) <  72,000 : would fail anyway -> NOT pivotal
        Payment = 0
  4. B - b(i) + f(i) >= 72,000 : your low pledge killed it -> PIVOTAL
        Payment = (B_other - F_other)      [no fair share, since nothing is built]
```

Note that a pivotal homeowner can pay a penalty **even when pledging honestly** - being pivotal is about whether your report changed the outcome, not about lying. The penalty equals the **externality** your decision imposed on the others.

## Why the Pivot Mechanism Works - the Second-Price Auction Analogy

The pivot mechanism is a **cousin of the second-price (Vickrey) auction**, where the highest bidder wins but pays the **second-highest bid**. Because your bid decides *whether you win* but not *how much you pay*, bidding your true value is a **dominant strategy** - best no matter what others do.

The pivot mechanism copies this logic:

- Your **pledge decides whether the elevator is built**, but **not how much you pay** (you pay the fixed fair share).
- The **penalty** makes you internalize the effect of being pivotal.
- Therefore **pledging your true value, b = v, is a (weakly) dominant strategy**.

The properties to memorize - this is exam gold:

- **Dominant-strategy incentive compatible**: truth-telling is optimal regardless of others' pledges.
- **Efficient**: when everyone is honest, B equals the sum of true values, so the rule "build if B is at least 72,000" is exactly the Samuelson condition "build if total value is at least cost."
- **No deficit**: fair shares fully cover the cost; penalties create a surplus, never a shortfall.
- **No worse than a committee**: a participant's outcome under the pivot mechanism is never worse than the worst case under committee rule.

One catch - the **surplus problem**: the penalties produce extra money. It **cannot be redistributed back to the participants** in any way that depends on their behaviour, or it would distort incentives again. It must be "burned" - given to an outside party (the case suggests a scholarship fund).

## Worked Example - Should You Pledge Honestly?

Setup from the case: you live on the **second floor**. Your fair share is **f = EUR 2,050**, but you value the elevator at only **v = EUR 1,050** - that is, you would *lose* EUR 1,000 if it is built and you pay your fair share. Your payoff is `v − payment` if it is built, and `−penalty` if it is not (no fair share when nothing is built).

Here `F_other = 72,000 − 2,050 = EUR 69,950`. Consider two scenarios for everyone else's pledges.

Scenario 1 - others pledge B_other = EUR 71,000 (efficient outcome: BUILD, since 71,000 + 1,050 > 72,000):

| Your pledge | Total B | Built? | Pivotal? | Payment | Your payoff |
| ---: | ---: | :---: | :---: | ---: | ---: |
| 2,050 | 73,050 | Yes | No | 2,050 | −1,000 |
| 1,050 (honest) | 72,050 | Yes | No | 2,050 | −1,000 |
| 0 | 71,000 | No | Yes (killed it) | penalty 1,050 | −1,050 |

Scenario 2 - others pledge B_other = EUR 70,000 (efficient outcome: DO NOT BUILD, since 70,000 + 1,050 < 72,000):

| Your pledge | Total B | Built? | Pivotal? | Payment | Your payoff |
| ---: | ---: | :---: | :---: | ---: | ---: |
| 2,050 | 72,050 | Yes | No | 2,050 | −1,000 |
| 1,050 (honest) | 71,050 | No | Yes (killed it) | penalty 50 | −50 |
| 0 | 70,000 | No | Yes (killed it) | penalty 50 | −50 |

What the two tables teach:

- In Scenario 1, **understating (pledging 0) backfires** - you become pivotal in killing an elevator that should be built, and pay a EUR 1,050 penalty (worse than the honest −1,000).
- In Scenario 2, **overstating (pledging 2,050) backfires** - you tip a project that should not be built, and lose EUR 1,000 (worse than the honest −50).
- **Honest pledging (b = v) is never worse** than any alternative, in either scenario. Since you do not know what others will pledge, honesty is the **dominant strategy**.
- The mechanism still works with **negative pledges** - a ground-floor resident who dislikes the elevator can pledge a negative number, and the logic is unchanged.

## Exam Toolkit - Solving an Elevator-Type Case

For any "group must collectively fund a shared project" case:

1. **Classify it**: public-good provision plus a preference-revelation problem.
2. **State the efficiency rule**: provide the good if and only if the **sum of values is at least the cost** (the Samuelson condition).
3. **Build the cost-sharing options**: pro rata (equal), usage-based / incremental, and any average or hybrid. Show the arithmetic.
4. **Critique the naive decision rules**: committee (paternalistic), majority vote (ignores intensity), pledge-pays-pledge (free-riding).
5. **Apply the pivot mechanism**. For each agent: compute B, then B_other and F_other; run the pivotal test by comparing B with B − b(i) + f(i); compute payment = f(i), plus the penalty if pivotal.
6. **State the properties**: truth-telling is a dominant strategy, the outcome is efficient, there is no deficit, and the surplus must be given away outside the group.

## Formula Sheet

```text
Samuelson condition (discrete project):
    Build  iff  sum of v_i  >=  Cost C

Pivot mechanism:
    B        = sum of all pledges b(i)
    Decision : build iff B >= C
    B_other  = B - b(i)
    F_other  = C - f(i)

    Pivotal?  Compare B and (B - b(i) + f(i)) against C.
              Same side  -> not pivotal
              Opposite   -> pivotal

    Payment if built  & not pivotal : f(i)
    Payment if built  & pivotal     : f(i) + (F_other - B_other)
    Payment if not built & not pivotal : 0
    Payment if not built & pivotal     : (B_other - F_other)

    Penalty (when pivotal) = | B_other - F_other |

Payoff:
    If built     : payoff = v(i) - payment
    If not built : payoff = - penalty   (0 if not pivotal)
```

## Practice Questions

1. The elevator costs EUR 72,000. You live on the **sixth floor** with fair share **f = EUR 5,175** and you value the elevator at **v = EUR 10,000**. Everyone else pledges **B_other = EUR 65,000**. If you pledge honestly, is the elevator built, are you pivotal, what do you pay, and what is your payoff?

   <details>
   <summary><b>Solution</b></summary>

   Honest pledge b = 10,000, so B = 75,000, which is at least 72,000 — **built**. Test: B − b + f = 65,000 + 5,175 = 70,175, which is below 72,000, so it would *not* have passed without you — you are **pivotal in approving it**. F_other = 72,000 − 5,175 = 66,825; penalty = F_other − B_other = 66,825 − 65,000 = **1,825**. Payment = f + penalty = 5,175 + 1,825 = **7,000**. Payoff = v − payment = 10,000 − 7,000 = **+3,000**. You still gain, because you genuinely value it.

   </details>
2. Explain why majority voting can produce an inefficient decision even when every vote is sincere.
3. Why must the surplus generated by the penalties be given to an outside party rather than refunded to the homeowners?
4. State the second-price-auction analogy and use it to explain why honest pledging is a dominant strategy.
5. A resident fails to submit any pledge. Discuss the consequences of treating the missing pledge as zero versus as the fair share.
