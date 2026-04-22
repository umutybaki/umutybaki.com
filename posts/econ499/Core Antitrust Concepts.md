---
title: "Core Antitrust Concepts - ECON 499 Study Guide"
date: "2026-04-22"
description: "Study guide covering antitrust law foundations, market definition and the SSNIP test, HHI concentration measures, market power, and the horizontal merger analysis framework for ECON 499."
---

# Core Antitrust Concepts - ECON 499 Study Guide
*Lectures 1 and 2 | Self-contained exam reference*

## Part 1 - What Is Antitrust and Why Does It Exist?

### The Origin: Trusts in the Late 19th Century

A **"trust"** was a legal arrangement where shareholders of competing companies handed their stock over to a single board of trustees. In return they got dividend-paying certificates, but actual control of all firms merged into one. The board could then coordinate prices and eliminate competition across an entire industry.

The textbook example is **Standard Oil (1882)**, formed by John D. Rockefeller. It controlled ~90% of US oil refining through three tactics you should know:
- **Predatory pricing**: slashing prices in specific regions to bankrupt rivals, then buying their assets cheaply.
- **Secret railroad rebates**: using massive volume to negotiate shipping discounts denied to competitors - an insurmountable cost advantage.
- **Vertical integration**: controlling wells, pipelines, refining, and distribution, creating enormous entry barriers.

Public outrage led to the **Sherman Antitrust Act of 1890**, the cornerstone of US competition law.

### The Goal of Antitrust Policy

> Antitrust law is not designed to protect individual competitors from failure. It is designed to protect the **competitive process itself**.

Two core economic objectives:
1. **Promote economic efficiency** - allocative efficiency (right quantities produced) and productive efficiency (produced at minimum cost).
2. **Maximize consumer welfare** - lower prices, higher output, more innovation. This is the dominant standard in US enforcement today.

**Antitrust vs. Regulation - a distinction the exam may test:**

| | Antitrust | Regulation |
|:---|:---|:---|
| Focus | *Acquiring* market power | *Behavior* of a firm that already has power |
| Scope | All industries | Specific sectors (utilities, telecom) |
| Timing | Ex post (after conduct) | Ex ante (rules set in advance) |
| Question asked | "Did the firm gain power through anticompetitive conduct?" | "Given its power, how should the firm behave?" |

### Key US Antitrust Laws

**Sherman Act (1890)**

- **Section 1 - Restraint of Trade**: prohibits contracts, combinations, or conspiracies that restrain trade. Targets *collusion* between competitors (price-fixing, bid-rigging, market allocation).
  - *Per se rule*: some acts (price-fixing) are automatically illegal - no need to show harm.
  - *Rule of reason*: other acts are evaluated by weighing pro- and anti-competitive effects.
- **Section 2 - Monopolization**: it is **not** illegal to be a monopoly. It **is** illegal to *acquire or maintain* monopoly power through anticompetitive or exclusionary conduct (e.g., predatory pricing, exclusive dealing).

**Clayton Act (1914)**

- **Section 7**: prohibits mergers where the effect "may be substantially to lessen competition, or to tend to create a monopoly." This is the legal basis for all modern merger analysis.
- **Section 3**: restricts tying arrangements and exclusive dealing that foreclose competitors from a substantial market share.

**Enforcement agencies** - DOJ (Department of Justice) and FTC (Federal Trade Commission) jointly enforce these laws at the federal level. The EU equivalent is the European Commission (DG COMP).

## Part 2 - Defining the Relevant Market

Before you can assess market power or analyze a merger, you must define **what market** you're talking about. This is often the most contested issue in any antitrust case - and almost certainly will be on the exam.

A relevant market has two dimensions:

### Product Market

Which products are reasonable substitutes? Two types of substitution matter:
- **Demand-side substitution**: would consumers switch if the price rose? (Look at cross-price elasticity, product characteristics, intended use.)
- **Supply-side substitution**: could producers easily switch to making the product? (Look at production flexibility, switching cost, time required.)

### Geographic Market

Where can buyers practically turn for supply? Factors: transportation costs relative to product value, perishability, information costs, regulatory barriers. Markets range from local (cement, hospitals) to global (aircraft, software).

### The SSNIP Test - The Modern Standard

The **SSNIP test** (Small but Significant and Non-transitory Increase in Price) is the practical tool for drawing market boundaries.

> **Core question**: Would a hypothetical monopolist controlling a proposed set of products profitably sustain a **5% price increase** for at least one year?

- **If YES** → customers don't have good enough alternatives → the proposed set *is* the relevant market.
- **If NO** → too many customers switch away → the market is too narrow. Add the next-best substitute and re-run the test.

**Worked example - Butter vs. Margarine:**

*Step 1*: Test "butter" alone. A 5% price hike by a hypothetical butter monopolist → many consumers switch to margarine for baking and spreading → unprofitable. Butter alone is too narrow.

*Step 2*: Test "butter + margarine." A 5% hike → consumers would need to switch to olive oil or lard, which most won't. The price increase is now profitable. **Butter + margarine = the relevant market.**

**Exam tip**: Narrow market definition → higher concentration → easier to show antitrust harm. Broad market definition → dilutes market shares → harder to show harm. Both sides in a case argue the definition that serves them.

## Part 3 - Measuring Market Concentration

Once the market is defined, regulators measure how concentrated it is.

### Concentration Ratios (CRn) - the old approach

CR4 = sum of the market shares of the four largest firms. Simple, but flawed: it ignores the *distribution* of shares within those four firms. Both of these markets have CR4 = 80, but they're very different:
- Market A: {20, 20, 20, 20, 5, 5, 5, 5} - relatively symmetric
- Market B: {70, 5, 3, 2, and 20 tiny firms} - one firm dominates

### The Herfindahl-Hirschman Index (HHI) - the standard today

$$HHI = \sum_{i=1}^{N} s_i^2$$

Market shares are expressed as whole numbers (30% → 30). The squaring gives more weight to larger firms, so it captures dominance better than CRn.

**Benchmarks:**

| Post-Merger HHI | Market Type | Agency Action |
|:---|:---:|:---|
| Below 1,500 | Unconcentrated | Unlikely to be challenged |
| 1,500 – 2,500 | Moderately concentrated | Concern if ΔHHI > 100 |
| Above 2,500 | Highly concentrated | Concern if ΔHHI > 100; presumed harmful if ΔHHI > 200 |

**Key reference points:**
- Monopoly (one firm, s = 100): HHI = 100² = **10,000**
- 4 equal firms (s = 25 each): HHI = 4 × 625 = **2,500**
- 10 equal firms (s = 10 each): HHI = 10 × 100 = **1,000**

**Calculating ΔHHI for a merger of firms i and j:**

$$\Delta HHI = 2 \times s_i \times s_j$$

*Example*: Firm A has 30% share, Firm B has 20% share. They merge.
- Pre-merger HHI contribution from these two: 30² + 20² = 900 + 400 = 1,300
- Post-merger: (30+20)² = 2,500
- ΔHHI = 2,500 − 1,300 = **1,200** ← also equals 2 × 30 × 20 = 1,200 ✓

**Important caveat**: HHI is only a *screen*. A merger in the "safe" zone can still be challenged if there's strong evidence of harm. A merger in the "harmful" zone can be cleared if efficiencies are large or competitive effects are weak.

## Part 4 - Market Power

High concentration suggests firms *might* have market power - but structure alone is not enough. You need a direct measure.

### Definition

> **Market power** is the ability of a firm to profitably maintain a price above its marginal cost.

In perfect competition, P = MC → no market power. A firm with market power faces a downward-sloping demand curve and can raise price without losing all its customers.

### The Lerner Index

$$L = \frac{P - MC}{P}$$

- Ranges from 0 (perfect competition) to 1 (extreme monopoly power).
- A higher L means the firm is pricing further above cost - more market power.

**Relationship to elasticity**: For a profit-maximizing firm (MR = MC), it can be shown that:

$$L = \frac{1}{|\varepsilon_d|}$$

where ε_d is the price elasticity of demand facing the firm. This means:
- More inelastic demand → fewer substitutes → greater market power → higher L.
- More elastic demand → many substitutes → less market power → lower L.

**Worked examples from lecture:**

*Example 1 - Patented drug*: P = $100, MC = $20.
$$L = \frac{100 - 20}{100} = 0.80$$
Substantial market power. Implied |ε_d| = 1/0.80 = 1.25 (relatively inelastic).

*Example 2 - Wheat farmer*: P = $5, MC = $4.90.
$$L = \frac{5 - 4.90}{5} = 0.02$$
Nearly zero - as expected in a competitive commodity market.

## Part 5 - Economics of Horizontal Mergers

A **horizontal merger** is between firms competing in the same product and geographic market (e.g., two airlines operating the same routes, two banks in the same city). The antitrust question under Clayton Act §7: does the merger substantially lessen competition?

Every merger analysis involves a core trade-off:
- **Anticompetitive effect**: more concentration → more market power → higher prices.
- **Pro-competitive effect**: cost-saving efficiencies (economies of scale, better management, R&D savings).

### Unilateral Effects

Unilateral effects are price increases the merged firm can profitably impose on its own, without any coordination with rivals.

**The logic**: Before the merger, if Firm A raises its price, it loses customers to Firm B. After the merger, Firm AB doesn't care if customers switch from product A to product B - it still captures those sales. The merger *internalizes the externality*, giving the merged firm an incentive to raise price unilaterally.

**Cournot model illustration** (3 firms → merger of 2):

*Pre-merger (triopoly)*, with inverse demand P = a − bQ and MC = c:
- Each firm's output: q* = (a−c)/4b
- Total output: Q_pre = 3(a−c)/4b
- Price: P_pre = (a+3c)/4

*Post-merger (duopoly)*, no efficiency gains:
- Merged firm's output: q_M = (a−c)/3b
- Total output: Q_post = 2(a−c)/3b
- Price: P_post = (a+2c)/3

Since Q_post < Q_pre and P_post > P_pre, the merger is **anticompetitive** - it raises prices and reduces output.

### The Merger Paradox

Here's the surprising part: even though the merger harms consumers, it may be **unprofitable for the merging firms** in the simple Cournot model.

- Combined pre-merger profit (Firm 1 + Firm 2): 2 × (a−c)²/16b = (a−c)²/8b
- Post-merger profit of Firm M: (a−c)²/9b

Since 1/9 < 1/8, the merged firm earns *less* than the two firms did separately. Why? The **outsider (Firm 3) free-rides** - it raises its own output and profit in response to the merged firm's higher price, capturing the gains.

**Resolution - why do mergers happen then?**
1. **Efficiencies**: if the merger reduces marginal cost sufficiently (cM < c), it becomes profitable. With enough savings, prices could even fall post-merger.
2. **Wrong model**: Cournot with homogeneous goods is stylized. Mergers are more profitable (and more anticompetitive) with differentiated products or dominant firms.

### The Williamson Trade-Off

When a merger creates both higher prices (harm) and lower costs (benefit), regulators must weigh:

- **Allocative loss (A1)** - the deadweight loss from higher post-merger price:
$$A_1 \approx \frac{1}{2}(P_2 - P_1)(Q_1 - Q_2)$$

- **Productive gain (A2)** - the cost savings on surviving output:
$$A_2 \approx (AC_1 - AC_2) \times Q_2$$

> **Permit the merger if A2 > A1**, i.e., cost savings exceed the deadweight loss.

Note: A2 tends to be large (applies to all output) while A1 is a triangle (second-order effect). Small cost reductions can justify even significant price increases under a **total welfare standard**. Under a stricter **consumer welfare standard**, efficiencies must be passed through to consumers as lower prices.

### Coordinated Effects

Even if the merged firm can't raise prices on its own, the merger may make it easier for the *remaining* firms to collude.

**Why mergers facilitate coordination:**
- Fewer firms → easier to monitor compliance with a tacit or explicit agreement.
- More symmetry between remaining firms (similar costs, similar shares) → less incentive to deviate.
- If entry barriers are high, a cartel can sustain elevated prices longer.

A merger from 6 firms to 5 might barely move the HHI - but if it makes the market more symmetric and entry is hard, coordinated effects can be the real danger.

## Part 6 - The DOJ/FTC 5-Step Merger Analysis Framework

This is the structured process regulators follow and what you should apply in any exam question involving a merger:

**Step 1 - Market Definition**: Define the relevant product and geographic market using the SSNIP test.

**Step 2 - Market Concentration**: Calculate the post-merger HHI and ΔHHI. Use the thresholds to determine the screening result.

**Step 3 - Competitive Effects**: Assess unilateral effects (can the merged firm raise price alone?) and coordinated effects (does the merger make collusion easier?).

**Step 4 - Efficiencies**: Are there verifiable, merger-specific cost savings? Are they large enough to offset the price increase (Williamson trade-off)?

**Step 5 - Entry**: Would new entrants respond quickly enough to discipline a post-merger price increase? Entry must be *timely* (within 2 years), *likely* (profitable at pre-merger prices), and *sufficient* (enough scale to constrain price).

## Part 7 - Quick Math Reference (No Calculator Needed)

| Concept | Formula | Exam tip |
|:---|:---|:---|
| HHI | Σ sᵢ² (shares as whole numbers) | Monopoly = 10,000; perfect competition ≈ 0 |
| ΔHHI from merger of i and j | 2 × sᵢ × sⱼ | Faster than recalculating the full HHI |
| Lerner Index | (P − MC) / P | Also equals 1/\|ε_d\| for a profit-maximizing firm |
| Allocative loss (DWL) | ½ × ΔP × ΔQ | Triangle between old and new equilibria |
| Productive gain | ΔAC × Q_post | Rectangle of cost savings on surviving output |
| Cournot price (N firms, identical) | (a + Nc) / (N+1) | Increases toward monopoly price as N → 1 |

## Part 8 - Common Exam Mistakes to Avoid

**On market definition**: Don't define the market too broadly (it dilutes concentration and market power) or too narrowly without justification. Always use SSNIP logic: "would consumers switch if price rose 5%?"

**On HHI**: Remember shares go in as whole numbers (30, not 0.30). The formula is squaring and summing - don't add first then square.

**On the Lerner Index**: It measures *current* market power, not just structure. A firm with a large share but lots of competitive pressure (high elasticity) can still have a low Lerner Index.

**On unilateral vs. coordinated effects**: Unilateral = the merged firm acts alone; coordinated = the merger changes the strategic environment for all remaining firms. Both can matter simultaneously.

**On efficiencies**: They must be (1) merger-specific - couldn't be achieved without the merger, and (2) verifiable - not speculative. Courts are skeptical of efficiency claims.

**On graphs**: Always label axes (Price on Y, Quantity on X), mark P_competitive, P_monopoly, Q_competitive, Q_monopoly, and shade the DWL triangle clearly. Missing labels = lost points.