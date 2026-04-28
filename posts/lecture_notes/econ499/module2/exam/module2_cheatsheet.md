---
title: ECON 499 - Module 2 Exam Cheatsheet
date: "2026-04-22"
description: "Exam-ready reference for ECON 499 Module 2 covering market definition, HHI, merger effects, the Williamson trade-off, and antitrust case law (GE/Honeywell, De Beers, American Airlines)."
---

# ECON 499 - Module 2 Exam Cheatsheet
*Antitrust Economics | Final exam-ready reference*



## 1. What Antitrust Is (and Isn't)

**Antitrust law protects the competitive *process*, not individual competitors.** A firm failing because it was outcompeted is fine; a firm winning by suppressing competition is the problem. The two guiding goals are (i) **economic efficiency** (right quantities, produced at minimum cost) and (ii) **consumer welfare** (lower prices, more output, more innovation).

**Antitrust vs. Regulation.** Antitrust asks *"did the firm gain power through anticompetitive conduct?"* and applies ex post across all industries. Regulation asks *"given this firm has power, how should it behave?"* and applies ex ante in specific sectors (utilities, telecom).

### The three foundational US statutes

- **Sherman Act (1890) §1** - bans contracts/conspiracies in restraint of trade (price-fixing, bid-rigging, market allocation). These are judged under either the *per se* rule (automatically illegal) or *rule of reason* (weigh pro-vs. anti-competitive effects).
- **Sherman Act §2** - bans *monopolization*. Being a monopoly is legal; *acquiring or maintaining* monopoly power through exclusionary conduct (predatory pricing, exclusive dealing) is not.
- **Clayton Act (1914) §7** - the merger statute. Blocks mergers whose effect "may be substantially to lessen competition." §3 limits tying and exclusive dealing.

### Enforcement agencies

- **US:** DOJ (Department of Justice) + FTC (Federal Trade Commission). Consumer-welfare standard dominates.
- **EU:** European Commission, DG COMP (via the Merger Task Force). Broader standard - considers competitor welfare, portfolio effects, and future market structure more aggressively.
- **Key difference:** the EU can block a merger directly; the US generally must go to court.



## 2. Defining the Relevant Market (always Step 1)

Every antitrust analysis starts here. Market = **product dimension + geographic dimension**.

- **Product market:** what are the reasonable substitutes? Use *demand-side substitution* (would consumers switch?) and *supply-side substitution* (could producers easily retool?).
- **Geographic market:** where can buyers practically substitute? Driven by transport costs, perishability, regulation.

### The SSNIP Test (the standard tool)

**Small but Significant and Non-transitory Increase in Price** - usually 5% for one year. Ask: *would a hypothetical monopolist of this product set profitably sustain a 5% price increase?*

- **Yes** → the set is the relevant market.
- **No** → too many customers switch; widen the market by adding the next-best substitute, then re-run.

**Worked example - butter.** A 5% price hike on butter alone sends too many people to margarine → unprofitable → market is too narrow. Re-run with "butter + margarine" → consumers won't switch to olive oil → profitable → that's the market.

### Exam intuition

- **Narrow market** → higher concentration → easier to show harm (regulators prefer narrow).
- **Broad market** → lower concentration → easier to defend a merger (firms prefer broad).
- Always justify your definition before computing shares; a different market definition often flips the conclusion.



## 3. Measuring Market Concentration

**Concentration Ratio (CRn)** - sum of shares of the top *n* firms. Simple but ignores distribution - {20,20,20,20} and {70,5,3,2} can both give CR4 = 80.

**Herfindahl-Hirschman Index (HHI)** - the modern standard. Squaring weights larger firms more heavily.

$$HHI = \sum_{i=1}^{N} s_i^2 \quad\text{(shares as whole numbers)}$$

| Post-merger HHI | Classification | Agency response |
|---:|:---|:---|
| < 1,500 | Unconcentrated | Safe harbor |
| 1,500 – 2,500 | Moderately concentrated | Concern if ΔHHI > 100 |
| > 2,500 | Highly concentrated | Presumed harmful if ΔHHI > 200 |

**Shortcut for the change in HHI when firms i and j merge:**

$$\Delta HHI = 2 \times s_i \times s_j$$

**Worked example.** Shares A=35, B=25, C=20, D=20. Pre-merger HHI = 35² + 25² + 20² + 20² = 1,225 + 625 + 400 + 400 = **2,650**. A and B merge: ΔHHI = 2 × 35 × 25 = **1,750**, post-merger HHI = **4,400**. Highly concentrated, ΔHHI ≫ 200 → **presumptively anticompetitive**.

Reference points to memorize: monopoly = 10,000; four equal firms = 2,500; ten equal firms = 1,000.



## 4. Market Power

**Market power** = the ability to profitably price above marginal cost. Under perfect competition P = MC; under market power P > MC.

### Lerner Index

$$L = \frac{P -MC}{P}$$

Ranges 0 (competition) to 1 (extreme monopoly). For a profit-maximizer, L also equals **1/|ε_d|**, where ε_d is own-price elasticity. So more inelastic demand = fewer substitutes = more market power.

**Examples:** patented drug priced at $100 with MC = $20 → L = 0.80, implied |ε_d| = 1.25 (high market power). Wheat farmer P = $5, MC = $4.90 → L = 0.02 (none - as expected for a commodity).

### Monopoly pricing, DWL, and welfare

Monopolist sets MR = MC, then reads price off the demand curve. Because demand slopes down, P > MC at that point. The triangle between the competitive outcome (P=MC, large Q) and the monopoly outcome (higher P, smaller Q) is **deadweight loss (DWL)**:

$$DWL \approx \tfrac{1}{2}(P_m -P_c)(Q_c -Q_m)$$

CS falls, PS may rise, but total surplus (CS + PS) falls by the DWL - this is the economic case against monopoly.



## 5. Horizontal Mergers

A **horizontal merger** is between competitors in the same relevant market. Distinct from:
- **Vertical merger** - different stages of a supply chain.
- **Conglomerate merger** - unrelated markets (e.g., GE + Honeywell).

Every merger trades off: **anticompetitive effect** (higher concentration → market power → higher prices) vs. **pro-competitive effect** (cost-saving efficiencies).

### 5a. Unilateral Effects

The merged firm can profitably raise price *on its own*, without any coordination.

**Intuition:** pre-merger, Firm A loses customers to Firm B when it raises price - that's what disciplines A. Post-merger, Firm AB still captures those sales (the switchers now just move between its own products). The merger **internalizes the competitive externality**, so AB has an incentive to raise price.

This is strongest when the merging firms are **close substitutes** (high *diversion ratio* - the fraction of A's lost sales that go to B). **GUPPI** (Gross Upward Pricing Pressure Index) is the formal metric regulators use.

### 5b. Cournot Illustration (3 firms → merger of 2)

Linear demand P = a − bQ, marginal cost c for all firms.

*Pre-merger triopoly:*
- Each firm: q* = (a−c)/(4b)
- Total Q_pre = 3(a−c)/(4b)
- P_pre = (a + 3c)/4
- Profit per firm = (a−c)²/(16b)

*Post-merger duopoly (no efficiencies):*
- Firm M and outsider each: q = (a−c)/(3b)
- Total Q_post = 2(a−c)/(3b)
- P_post = (a + 2c)/3
- Firm M's profit = (a−c)²/(9b)

P_post > P_pre and Q_post < Q_pre → merger is anticompetitive. **General Cournot formula:** with N equal firms, P* = (a + Nc)/(N+1). Price rises toward monopoly as N falls.

### 5c. The Merger Paradox

Combined pre-merger profit = 2 × (a−c)²/(16b) = (a−c)²/(8b). Post-merger profit = (a−c)²/(9b). Since 1/9 < 1/8, the merged firm earns **less** than the two standalone firms.

**Why?** The outsider free-rides - it raises its output in response to M's restriction, capturing gains without having paid for the merger. **Resolution:** real mergers involve (1) meaningful cost **efficiencies** that make MC lower, or (2) **differentiated products / dominant firms** where Cournot-homogeneous isn't the right model. Both make mergers both more profitable *and* more anticompetitive.

### 5d. The Williamson Trade-off

When a merger simultaneously raises price (harm) and lowers cost (benefit):

- **Allocative loss** (triangle, 2nd-order): A₁ ≈ ½ × (P₂ − P₁) × (Q₁ − Q₂)
- **Productive gain** (rectangle, 1st-order): A₂ ≈ (AC₁ − AC₂) × Q₂

**Permit the merger if A₂ > A₁.** Because A₂ is a rectangle applying to *all* surviving output and A₁ is a triangle on the *lost* output, even small cost savings can offset big price increases under a **total welfare** standard. Under a **consumer welfare** standard, the cost savings must be *passed through* to consumers as lower prices.

Efficiency defenses must be **merger-specific** (not achievable without the merger), **verifiable** (not projections), and **cognizable** (not from reducing competition itself).

### 5e. Coordinated Effects

Even if the merged firm doesn't unilaterally raise price, the merger may make it easier for *all* remaining firms to collude (tacitly or explicitly).

**Mergers facilitate coordination when** they reduce the number of firms (easier monitoring), make firms more symmetric (aligned interests), stabilize cost/demand conditions, and when entry barriers are high.

Exam tip: in a market that was already oligopolistic with a history of parallel pricing, coordinated effects are often the main concern.

### 5f. Remedies

- **Structural (US preferred):** divestitures - sell overlapping assets to a viable buyer. Creates a real independent competitor.
- **Behavioral (EU more common):** conduct obligations - price caps, access requirements, non-discrimination rules. Harder to monitor, may not fully restore competition.

### 5g. Entry as a Defense

New entry defeats anticompetitive concern only if it is **timely** (within ~2 years), **likely** (profitable at pre-merger prices), and **sufficient** (scale large enough to actually constrain price).



## 6. The DOJ/FTC 5-Step Framework (use this structure on the exam)

1. **Market definition** - product + geography via SSNIP logic.
2. **Concentration** - compute HHI and ΔHHI, apply thresholds.
3. **Competitive effects** - unilateral (close substitutes? diversion?) and coordinated (few firms? symmetric? high barriers?).
4. **Efficiencies** - merger-specific, verifiable, large enough to run the Williamson comparison.
5. **Entry** - timely, likely, sufficient?

Conclude with a remedy recommendation (structural vs. behavioral) and a net welfare assessment.



## 7. Case 1 - GE / Honeywell (2001)

**Facts.** GE (jet engines, plus GE Capital and GECAS leasing) proposed a $45B acquisition of Honeywell (avionics + non-avionics, engine starters, some engine segments). **DOJ approved** with trivial remedies (divest a helicopter engine business). **EU (Monti's MTF) blocked** it - the first time an all-American merger cleared in the US but was stopped in Brussels.

**Why the disagreement:** neither firm dominated the *same* market → little horizontal overlap → US saw no serious problem. But the EU built a theory around vertical and **conglomerate (portfolio) effects**.

### The EU's three layers of harm

- **Horizontal:** combined near-monopoly in *large regional jet engines* (GE 60–70% installed base + Honeywell 30–40%), plus overlap in corporate-jet engines and small marine gas turbines. These were relatively modest - the DOJ's remedies targeted these.
- **Vertical:**
  - **GECAS as a demand lever.** GE's leasing arm bought ~10% of all new aircraft and enforced a GE-only engine policy. Post-merger, it could extend this to Honeywell avionics/non-avionics, foreclosing Rockwell Collins, Thales, Hamilton Sundstrand.
  - **GE Capital as a financial lever.** Enabled deep upfront discounts, R&D funding for airframers in exchange for engine exclusivity, and acquisitions of MRO providers. Rivals couldn't match it.
  - **Honeywell engine starters.** Honeywell sold these to Rolls-Royce. Post-merger, GE would control a key input for its main engine competitor - classic **vertical foreclosure**.
- **Conglomerate / portfolio effects (the controversial bit):**
  - **Bundling.** Only GE-Honeywell could offer a full "nose-to-tail" package: engines + avionics + non-avionics + MRO + financing. The combined firm could tilt customer decisions with bundled discounts that single-product rivals (Rolls-Royce, Thales) couldn't replicate.
  - **Foreclosure cascade.** Bundling + GECAS + GE Capital → rivals lose volume → higher unit costs → less R&D → eventual exit. Rolls-Royce (pure engine maker) was identified as the most vulnerable. Long-run market becomes a GE-P&W duopoly.

### Why this matters for the exam

- **US vs. EU framing.** US (consumer welfare): bundling is *pro-consumer* in the short run (lower prices), portfolio effects are speculative, no structural overlap → approve. EU (forward-looking, broader welfare): even short-term consumer gains can't outweigh long-run harm from competitor exit → block.
- **Lesson:** the *same* transaction can be cleared or killed depending on the legal standard and which theories of harm are admissible.
- **Concepts to apply on exam questions** that look like GE/Honeywell: separate-market definition, horizontal vs. vertical vs. conglomerate effects, foreclosure theory, and why the EU demanded far more aggressive remedies than the DOJ.

Key terms: **Dominance** (EU legal standard), **MTF**, **Phase I / Phase II**, **GECAS**, **installed base**, **MRO**, **CFMI / IAE** joint ventures (the MTF attributed all of CFMI's share to GE, inflating GE's numbers), **BFE vs. SFE**.



## 8. Case 2 - De Beers and US Antitrust

**Facts.** De Beers controlled roughly 80% of world rough diamonds for most of the 20th century through the **Central Selling Organisation (CSO)** in London. It stayed out of the US legally - no offices, no employees, no directors - selling only in London to a small set of **sightholders** who then exported. This let it evade US jurisdiction for decades despite multiple DOJ attempts (1945, 1976 industrial diamonds, 1994 civil suit vs. GE). Ultimately pleaded guilty to price-fixing in 2004 after it needed direct US market access to brand its own diamonds.

### How the cartel worked

- **Supply side:** initially owned all South African mines. When new sources emerged (Russia, Australia, Angola, Botswana), De Beers signed exclusive supply contracts - it controlled what it didn't own.
- **Distribution side - the CSO / sight system.** Ten times a year, sightholders received a plain brown box of pre-sorted diamonds at a price the CSO announced (no haggling, no cherry-picking). Refuse = lose your sightholding. This gave De Beers total control over who received what at what price.
- **Stockpiling.** During demand shocks (1981 interest rates; 1997 Asian crisis), De Beers *bought up* excess diamonds rather than letting prices fall. Stockpile reached $4.8B by 1998 - roughly a year's global sales. Possible only because of patient family capital (Oppenheimers) that tolerated years of weak returns to maintain price discipline.

### Core antitrust issues

- **Monopoly / dominant position.** ~80% share + control of distribution + contractual lock-up of rivals.
- **Cartel conduct.** Coordinating price and output across supposedly independent producers = per-se price-fixing under US law. The sight system's no-cherry-picking feature can also be framed as unlawful tying.
- **Barriers to entry.** Capital intensity of mining + locked-up supply contracts + CSO's network effect on retailers.
- **Market definition.** Rough vs. polished; gem-quality vs. industrial; synthetic vs. natural. Narrow "gem-quality rough diamonds" definition made the monopoly obvious.

### Legal concepts illustrated

- **Per se illegality** (US): price-fixing, bid-rigging, market allocation are illegal without any need to show actual harm.
- **Rule of reason:** most other restraints - weigh pro-vs. anticompetitive effects.
- **Effects doctrine** (*Hartford Fire Insurance v. California*, 1993): US antitrust reaches foreign conduct that has a substantial intended effect on US commerce, regardless of where the firm is based. De Beers was subject to the Sherman Act - it just wasn't *reachable*.
- **Evasion strategy:** minimize US legal presence → no jurisdictional hook for prosecution.

### Why this case illustrates the limits and power of antitrust

- **Cartel stability.** Cartels face the cheating incentive: if all restrict output and price rises, each member can earn more by deviating. De Beers solved this with (1) punitive price wars (release stockpile to crush defectors), (2) exclusion (revoke sightholder status), and (3) centralized output quotas via the CSO.
- **The branding dilemma (1998–99).** By the late 90s De Beers's share had fallen below ~65%, the stockpile was destroying shareholder value, and Bain advised branding. But branding requires a US presence (the US is ~46% of retail diamond jewelry), and a US presence means direct antitrust exposure. De Beers had to *choose* between the cartel's invisibility and the brand's visibility.
- **Oppenheimer's HBS plea:** argued the cartel served consumers through *price stability* and supported developing-country producers (Botswana, Namibia). The orthodox antitrust reply: cartels always claim efficiency justifications; a categorical rule against them is what gives the law any force at all.

### Concepts to apply - De Beers

- Monopoly pricing and DWL calculation.
- **Cartel stability economics** - why they break down (cheating, entry, demand shocks, changes in owner incentives).
- **Geographic market definition and jurisdiction** - why locating outside the US mattered.
- **Vertical integration as a cartel-enforcement tool** - the CSO's centralized distribution was what made the cartel workable.
- **Branding and product differentiation** - the 15% brand premium De Beers found in its UK pilot shows how brands can sustain price above cost even without explicit collusion.



## 9. Case 3 - American Airlines / US Airways (2013)

**Facts.** Proposed merger between two major US legacy carriers. DOJ sued to block, eventually settled with structural divestitures. Created the world's largest airline.

### Core issues

- **Horizontal merger** in an already highly concentrated industry.
- **Route-level market definition.** Each city-pair (e.g., Boston–Dallas) is its own market, because a flight from Boston to Dallas is not a substitute for a flight from Boston to Miami. HHI must be computed at the route level, not nationally.
- **Unilateral effects.** On overlapping routes, fewer competitors → higher fares.
- **Coordinated effects.** Already oligopolistic; merger increases symmetry among the "big three" legacies (AA, Delta, United), making tacit parallel pricing easier.

### Defenses raised and how they fared

- **Efficiencies** - network scope, international connectivity, cost savings.
- **Failing firm** - US Airways had been financially distressed (but not a failing firm in the strict sense).
- **Entry** - LCCs (Southwest, JetBlue, Spirit) argued to discipline fares on many routes.

### Remedy

Divested **slots and gates at key capacity-constrained airports** (Reagan National, LaGuardia, O'Hare, Boston, LAX, Dallas Love Field) to LCCs. This is a **structural** remedy: by transferring scarce airport capacity to low-cost carriers, the DOJ preserved meaningful competition on the most affected city-pairs.

### Concepts to apply - American Airlines

Route-by-route HHI, unilateral vs. coordinated effects in oligopolies, the role of entry (LCCs) in defeating anticompetitive concerns, and why **structural remedies** at specific chokepoints (airport slots) can be more effective than blocking an entire merger.



## 10. Bonus case from lecture - Whole Foods / Wild Oats (2007)

Illustrates that **market definition is often the whole ballgame.**

- FTC's narrow market: "premium natural/organic supermarkets" → near-monopoly post-merger.
- Whole Foods' broad market: "all supermarkets" (Kroger, Safeway now sell organic) → small combined share, no concern.
- District Court sided with the broad definition, the merger closed. On appeal, the DC Circuit accepted the narrow definition, restoring the FTC's case. Eventually Whole Foods divested 32 former Wild Oats stores.

**Takeaway:** if the exam hands you a case with ambiguous substitutability, spend real time on SSNIP logic before computing anything.



## 11. Analytical Framework for Any Exam Case

Work through the steps in order and state each one explicitly - graders reward structure.

1. **Define the market** (product + geography). Justify with SSNIP logic.
2. **Concentration.** Compute HHI and ΔHHI; apply thresholds.
3. **Type of harm.** Unilateral effects? Coordinated effects? Vertical foreclosure? Conglomerate/bundling?
4. **Defenses.** Efficiencies (merger-specific, verifiable)? Entry (timely, likely, sufficient)? Failing firm?
5. **Remedy.** Structural (divestiture) usually preferred; behavioral if integration is unavoidable.
6. **Welfare conclusion.** Net effect on consumers; note the standard (consumer vs. total welfare).



## 12. Quick Math Reference

| Concept | Formula | Note |
|:---|:---|:---|
| HHI | Σ sᵢ² | Whole-number shares (30, not 0.30) |
| ΔHHI for i-j merger | 2 × sᵢ × sⱼ | Faster than full recalc |
| Lerner Index | (P − MC)/P | = 1/\|ε_d\| at profit-max |
| Cournot price (N equal firms) | (a + Nc)/(N+1) | → monopoly as N→1 |
| Cournot firm output | (a−c)/[(N+1)b] | |
| Cournot firm profit | (a−c)²/[(N+1)²b] | |
| DWL triangle | ½ × ΔP × ΔQ | Lost output × price wedge |
| Productive gain | ΔAC × Q_post | Rectangle on surviving output |
| Williamson rule | Approve if A₂ > A₁ | Under total welfare standard |

Benchmarks: monopoly HHI = 10,000; four equal firms = 2,500; ten equal firms = 1,000. ΔHHI > 200 in a highly concentrated market = presumptively anticompetitive.



## 13. Common Exam Mistakes to Avoid

- **Market definition:** don't default to broad or narrow. State it, justify with SSNIP logic, then proceed. A different definition often flips the answer.
- **HHI:** shares in whole numbers; *square first, then sum* - not the other way.
- **Unilateral vs. coordinated:** unilateral = merged firm acts alone; coordinated = merger changes the strategic environment for all remaining firms. Flag both when relevant.
- **Efficiencies:** must be merger-specific + verifiable. Don't accept projected synergies at face value.
- **Graphs:** always label axes (P on Y, Q on X), mark P_c, P_m, Q_c, Q_m, and shade the DWL triangle. Missing labels = lost points.
- **Describe vs. analyze:** the grader wants analysis using the tools above, not narration of the case facts. "GE was big" earns nothing; "GE's GECAS leverage + bundling + financing constituted conglomerate foreclosure because…" earns the marks.
- **State assumptions.** If the question is ambiguous, write down your assumption and solve consistently - you can still earn full credit.
- **US vs. EU:** if the case has a transatlantic angle (GE/Honeywell-style), explicitly contrast the consumer-welfare standard with the EU's broader/forward-looking frame.



## 14. One-Line Reminders

- Antitrust protects competition, not competitors.
- Markets first, concentration second, effects third, defenses fourth, remedy fifth.
- Cartels are per se illegal in the US - no efficiency defense is admissible.
- A cartel's biggest enemy is its own members' incentive to cheat.
- Mergers internalize competitive externalities → unilateral price incentive.
- Williamson: small cost savings can beat large price hikes under total welfare; under consumer welfare, pass-through must be shown.
- The EU worries about *future* market structure; the US about *current* consumer prices.
- Divestitures beat behavioral remedies in the US because they're self-enforcing.