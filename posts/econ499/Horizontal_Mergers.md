---
title: "Economics of Horizontal Mergers - ECON 499 Study Guide"
date: "2026-04-22"
description: "Study guide covering unilateral effects, the Cournot merger model, the merger paradox, the Williamson trade-off, coordinated effects, and the DOJ/FTC 5-step merger review framework for ECON 499."
---

# Economics of Horizontal Mergers - ECON 499 Study Guide
*Lecture 2 | Self-contained exam reference*

## What Is a Horizontal Merger?

A **horizontal merger** is a merger between firms that compete in the **same product and geographic market**. Classic examples: two airlines on the same routes, two banks in the same city, Coca-Cola and Pepsi merging.

This is distinct from:
- **Vertical merger**: firms at different stages of the supply chain (e.g., a manufacturer acquiring a distributor).
- **Conglomerate merger**: firms in unrelated markets (e.g., GE + Honeywell).

The legal standard comes from **Clayton Act §7**: a merger is prohibited where its effect "may be substantially to lessen competition, or to tend to create a monopoly." The operative word is *may* - regulators act before harm is certain.

## The Core Trade-Off

Almost every merger analysis reduces to weighing two opposing forces:

| Force | Direction | Mechanism |
|:---|:---:|:---|
| **Anticompetitive effect** | ↑ Price, ↓ Output | Higher concentration → more market power |
| **Pro-competitive effect** | ↓ Cost | Efficiencies: scale economies, better management, R&D savings |

The job of the regulator (and of you in an exam question) is to determine which force dominates.

## Part 1 - Unilateral Effects

### The Core Idea

**Unilateral effects** are price increases the merged firm can impose profitably on its own - without needing to coordinate with any rival. This is the most direct form of merger harm.

**The logic step by step:**

1. Before the merger, Firm A competes with Firm B. If A raises its price, it loses customers - some go to B, some leave the market entirely.
2. The customers who switch to B represent a *lost sale* from A's perspective. This is what disciplines A's pricing.
3. After the merger, Firm AB owns both products. If customers switch from product A to product B, Firm AB still captures that revenue.
4. The merger **internalizes the competitive externality** - the merged firm no longer "loses" when customers divert from one of its products to another. So it has a unilateral incentive to raise prices on both.

This logic applies most powerfully when the merging firms are **close substitutes** - i.e., when a large fraction of customers who leave product A go to product B (high diversion ratio).

### The Cournot Model: Pre-Merger (Triopoly)

The lecture formalizes this with a **Cournot (quantity-setting) model**. You should be able to follow the algebra and interpret the results.

**Setup:**
- 3 identical firms, each choosing quantity simultaneously
- Inverse demand: P(Q) = a − bQ, where Q = q₁ + q₂ + q₃
- Marginal cost = c for all firms (c < a)

**Symmetric equilibrium** - each firm solves max πᵢ = (P − c)qᵢ:

$$q^* = \frac{a-c}{4b} \quad \text{(each firm)}$$
$$Q_{pre} = \frac{3(a-c)}{4b} \quad \text{(total output)}$$
$$P_{pre} = \frac{a + 3c}{4} \quad \text{(market price)}$$
$$\pi_{pre} = \frac{(a-c)^2}{16b} \quad \text{(each firm's profit)}$$

**How to derive q\* (shown once for clarity):**

Firm 1 maximizes: π₁ = (a − b(q₁ + q₂ + q₃) − c)q₁

Taking the FOC with respect to q₁ and using symmetry (q₂ = q₃ = q*):

a − 2bq* − 2bq* − c = 0 → q* = (a−c)/4b ✓

### The Cournot Model: Post-Merger (Duopoly, No Efficiencies)

Now Firms 1 and 2 merge into Firm M. The market is now a duopoly (Firm M and outsider Firm 3). Crucially, assume **no cost savings** - marginal cost stays at c for both.

**New equilibrium:**

$$q_M = q_3 = \frac{a-c}{3b}$$
$$Q_{post} = \frac{2(a-c)}{3b}$$
$$P_{post} = \frac{a + 2c}{3}$$
$$\pi_{post}^M = \frac{(a-c)^2}{9b} \quad \text{(Firm M's profit)}$$

**Comparing pre and post:**

- Q_post = 2(a−c)/3b **<** Q_pre = 3(a−c)/4b → output *falls*
- P_post = (a+2c)/3 **>** P_pre = (a+3c)/4 → price *rises*

**Conclusion**: Even without any coordination, the merger is anticompetitive - it raises prices and harms consumers. This is the unilateral effect in action.

*Intuition*: Firm M now controls two plants worth of capacity but behaves like a single Cournot player. It restricts output to maximize joint profit on its two products, which raises the market price.

## Part 2 - The Merger Paradox

Here's the result that seems counterintuitive at first.

**Was the merger profitable?**

- Combined pre-merger profit of Firms 1 and 2: 2 × (a−c)²/16b = **(a−c)²/8b**
- Firm M's post-merger profit: **(a−c)²/9b**

Since 1/9 < 1/8, the **merged firm earns less than the two firms earned separately**. The merger is *unprofitable* for the insiders, even though it raises the market price!

**Why?** The outsider (Firm 3) is the real winner. When Firm M restricts its output post-merger, Firm 3 responds by *expanding* its own output (best-response dynamics in Cournot). Firm 3 free-rides on the price increase caused by Firm M's restraint, capturing market share without having paid for the merger. In the simple symmetric Cournot model, this free-riding effect dominates.

### Resolving the Paradox

If simple mergers are unprofitable, why do they happen? Two answers:

**Reason 1 - Efficiencies.** The model assumed MC was unchanged post-merger. If the merger reduces marginal cost to cM < c (economies of scale, plant closures, better procurement), the merged firm is more competitive. With a low enough cM, the merger becomes highly profitable - and may even *lower* consumer prices.

**Reason 2 - The model is wrong.** Cournot with identical homogeneous goods is stylized. In markets with **differentiated products** or a **dominant firm**, mergers are far more likely to be profitable and anticompetitive. The diversion ratio between the merging firms' products becomes crucial.

**Exam takeaway**: The merger paradox tells you that in simple models, the *outsider* benefits most. If you're asked who wins and loses from a merger - the answer often is: consumers lose, the outsider gains, and the merging firms may not benefit as much as expected (unless there are efficiencies).

## Part 3 - Efficiencies and the Williamson Trade-Off

When a merger both raises prices *and* reduces costs, regulators must trade off welfare losses against welfare gains. This is formalized in the **Williamson trade-off**.

### Setup

- Pre-merger: price P₁, quantity Q₁, average cost AC₁
- Post-merger: price P₂ > P₁ (merger raises price), quantity Q₂ < Q₁, average cost AC₂ < AC₁ (merger creates efficiencies)

### Two Areas to Compare

**Allocative loss (A1) - the deadweight loss triangle:**

$$A_1 \approx \frac{1}{2}(P_2 - P_1)(Q_1 - Q_2)$$

This is the welfare lost because output contracts from Q₁ to Q₂. Consumers who would have bought at the old price but won't at the new, higher price are priced out. This is a *second-order* effect (it scales with the *square* of the price change).

**Productive gain (A2) - the cost savings rectangle:**

$$A_2 \approx (AC_1 - AC_2) \times Q_2$$

This is the resource saving from producing Q₂ units at lower average cost. This is a *first-order* effect (it scales linearly with the cost reduction and the quantity produced).

### The Decision Rule

> **Permit the merger if A2 > A1**
>
> That is: cost savings > deadweight loss

**Key insight**: Because A2 is a rectangle and A1 is a triangle, even **small cost reductions can justify significant price increases** under a total welfare standard. The productive gain tends to dominate unless the price increase is very large or the cost savings are tiny.

### Welfare Standards Matter

| Standard | What's counted | Implication |
|:---|:---|:---|
| **Total welfare** | CS + PS (A2 > A1 is enough) | Efficiencies easier to justify |
| **Consumer welfare** | CS only | Efficiencies must be *passed through* as lower prices |

US antitrust law nominally uses a consumer welfare standard, so efficiency claims must show that consumers themselves benefit - not just that costs fall for shareholders.

### Requirements for an Efficiency Defense

For efficiencies to count as a defense in US merger review, they must be:
1. **Merger-specific**: the savings couldn't be achieved without the merger (e.g., not achievable via a licensing agreement or organic growth).
2. **Verifiable**: concrete and supported by evidence - not speculative projections.
3. **Cognizable**: don't come at the expense of competition (e.g., cost savings from eliminating a rival's R&D don't count).

## Part 4 - Coordinated Effects

**Coordinated effects** are a second, distinct channel of harm. The concern is not that the merged firm will raise prices unilaterally, but that the merger restructures the market in a way that makes **tacit or explicit collusion among all remaining firms easier and more stable**.

### Why Mergers Facilitate Coordination

A cartel or tacit collusive arrangement is easier to sustain when:

- **Fewer firms**: easier to detect deviations and punish cheaters.
- **More symmetry**: firms with similar cost structures and market shares have aligned interests - less temptation to undercut.
- **Stable demand and costs**: collusion is harder when conditions shift unpredictably (makes deviations hard to distinguish from market noise).
- **High entry barriers**: if new entry is difficult, firms can sustain high prices without attracting competitors.

**Example**: A market with 6 firms merges down to 5. The HHI change may be modest and unilateral effects weak. But if the merger makes the remaining 5 firms more symmetric in cost and capacity, the risk of coordinated price-setting increases substantially. This is a coordinated-effects concern.

**Exam tip**: If a question involves a market that was *already* oligopolistic or has a history of coordination, flag coordinated effects explicitly. They're often more relevant than unilateral effects in such settings.

## Part 5 - The DOJ/FTC 5-Step Horizontal Merger Guidelines Framework

This is the **exact analytical sequence** you should follow when analyzing any merger question on the exam. The 2010 Horizontal Merger Guidelines are the operational document regulators use.

### Step 1 - Market Definition

Define the relevant **product market** and **geographic market** using the SSNIP test (see Core Antitrust Concepts guide for full detail). The market definition determines who competes with whom and sets the denominator for market share calculations.

**Practical exam move**: State your market definition first, justify it briefly with SSNIP logic, then proceed. A different market definition often leads to a completely different conclusion.

### Step 2 - Market Concentration (HHI Screen)

Calculate the **post-merger HHI** and **ΔHHI**.

$$HHI = \sum s_i^2 \qquad \Delta HHI = 2 \times s_i \times s_j$$

Apply the thresholds:

| Post-Merger HHI | Market | Agency Response |
|:---|:---:|:---|
| < 1,500 | Unconcentrated | Unlikely to challenge |
| 1,500 – 2,500 | Moderately concentrated | Challenge if ΔHHI > 100 |
| > 2,500 | Highly concentrated | Challenge if ΔHHI > 100; presume harmful if ΔHHI > 200 |

**Remember**: HHI is only a screening tool. A merger that passes the screen can still be challenged; one that fails can still be cleared.

**Worked example:**

Market shares before merger: A = 35%, B = 25%, C = 20%, D = 20%.

Pre-merger HHI = 35² + 25² + 20² + 20² = 1,225 + 625 + 400 + 400 = **2,650**

A and B merge. ΔHHI = 2 × 35 × 25 = **1,750**

Post-merger HHI = 2,650 + 1,750 = **4,400**

→ Highly concentrated market, ΔHHI >> 200 → **presumptively anticompetitive**.

### Step 3 - Competitive Effects

Assess both channels:

**Unilateral effects** - ask:
- Are the merging firms close substitutes? (High diversion ratio?)
- Does the merged firm control a large enough combined share to profitably raise price alone?
- Are remaining competitors close enough to discipline the price increase?

**Coordinated effects** - ask:
- Does the merger increase market symmetry?
- Are there historical signs of coordination in this industry?
- Do entry barriers prevent new firms from breaking up a cartel?

### Step 4 - Efficiencies

If the parties claim the merger generates cost savings, regulators evaluate whether these are:
- **Merger-specific** (couldn't happen otherwise)
- **Verifiable** (documented, not speculative)
- **Large enough** to offset the price increase under the applicable welfare standard

In practice, efficiency defenses are hard to win. Regulators are skeptical of projected savings, especially those claimed at the time of merger review when firms have incentive to overstate benefits.

### Step 5 - Entry

Would potential entry by new firms prevent a post-merger price increase? Entry must be:
- **Timely**: within approximately 2 years.
- **Likely**: would be profitable at the elevated post-merger price.
- **Sufficient**: enough scale to actually constrain price, not just token competition.

If entry is easy and rapid, it can defeat both unilateral and coordinated effects concerns - the merged firm can't sustain high prices because new entrants will undercut it. If entry requires large sunk costs, regulatory approvals, or years of development, it is not a credible constraint.

## Part 6 - Real-World Application: Whole Foods / Wild Oats (2007)

This case from lecture illustrates how market definition can make or break a merger challenge.

**The merger**: Whole Foods (the dominant premium natural/organic grocer) sought to acquire Wild Oats (its main direct competitor).

**The FTC's narrow market**: "Premium natural and organic supermarkets." The FTC argued that core Whole Foods customers - health-conscious shoppers buying organic produce and specialty items - would not switch to Safeway or Kroger even if Whole Foods raised prices 5%. These customers valued the curated organic selection, the store atmosphere, and the brand identity enough to pay more. Under this definition, the merger was a near-monopoly.

**Whole Foods' broad market**: "All supermarkets." Conventional grocers had rapidly expanded their organic sections. In a broad market, Whole Foods and Wild Oats had small combined shares - no antitrust concern.

**What happened:**
1. *Initial ruling (2007)*: District Court sided with Whole Foods. The FTC hadn't met its burden of proof on the narrow market definition - the merger closed.
2. *Appeal (2008)*: The D.C. Circuit reversed, ruling the FTC's narrow definition was plausible. The case was reinstated.
3. *Remedy (2009)*: With the appellate ruling in hand, the FTC had leverage. Whole Foods agreed to divest 32 former Wild Oats stores to restore competition.

**Key lesson**: Market definition is not just technical - it is often the entire dispute. Here, the same merger was simultaneously a near-monopoly (narrow market) and a minor consolidation (broad market). Getting the market definition right is the most important analytical step.

## Part 7 - Remedies

When a merger is found anticompetitive, regulators don't always block it outright. They may require remedies:

**Structural remedies (preferred in the US):**
- The merging parties must **divest** (sell off) overlapping business units or assets to a viable buyer.
- Creates a new independent competitor to replace the competitive constraint that would be lost.
- Example: Whole Foods divesting 32 stores; AA/US Airways divesting airport slots.

**Behavioral remedies (more common in the EU):**
- Impose conduct obligations on the merged firm: price caps, access requirements, non-discrimination rules.
- Don't require selling assets - instead regulate behavior going forward.
- Criticism: harder to monitor and enforce; may not fully restore competition.

## Part 8 - Full Exam Framework for Any Merger Question

When given a "small case" involving a merger, work through this in order:

1. **Define the market** - product + geography, justify with SSNIP logic.
2. **Calculate HHI and ΔHHI** - show the arithmetic, apply the thresholds.
3. **Unilateral effects** - are the firms close substitutes? Can the merged entity profitably raise price alone?
4. **Coordinated effects** - does the merger make tacit collusion more likely? Check: fewer firms, more symmetry, entry barriers.
5. **Efficiencies** - are claimed cost savings merger-specific and verifiable? Run the Williamson comparison if numbers are given.
6. **Entry** - is entry timely, likely, and sufficient to constrain the merged firm?
7. **Conclusion and remedy** - overall welfare assessment; structural vs. behavioral remedy if needed.

## Part 9 - Quick Reference

| Concept | Formula / Threshold | Note |
|:---|:---|:---|
| HHI | Σ sᵢ² | Shares as whole numbers |
| ΔHHI | 2 × sᵢ × sⱼ | Faster than full recalculation |
| Unconcentrated | HHI < 1,500 | Safe harbor |
| Moderate concern | HHI 1,500–2,500, ΔHHI > 100 | Investigate further |
| Presumed harmful | HHI > 2,500, ΔHHI > 200 | Strong case against merger |
| Allocative loss | ½ × ΔP × ΔQ | Triangle |
| Productive gain | ΔAC × Q_post | Rectangle |
| Approve if | A2 > A1 | Under total welfare standard |
| Cournot price (N equal firms) | (a + Nc) / (N+1) | Approaches monopoly as N → 1 |
| Merger Paradox | π_M < π_1 + π_2 | Outsider free-rides; efficiencies needed |