---
title: "ECON 499 - Module 2 Practice Exam"
date: "2026-04-22"
description: "Practice exam covering horizontal merger analysis, market definition and market power, cartel theory and deadweight loss, conglomerate effects and bundling, and merger remedies."
---

# ECON 499 - Module 2 Practice Exam

**Instructions:** This exam has 5 questions with subparts, totaling 100 points. Each question presents a short case. Analyze it using the antitrust tools covered in class. Show all steps in your reasoning and calculations. Label all graphs clearly. State any assumptions you make explicitly. You may not use a calculator - all numbers are designed to be solved by hand.

## Question 1 - Horizontal Merger Analysis (40 points)

**Case:** Two hospital systems in a mid-sized regional city, MedNorth and MedSouth, have proposed a merger. There are four hospitals currently operating in this city. Their market shares (measured by patient volume) are as follows:

| Hospital | Market Share |
|:---|---:|
| MedNorth | 35% |
| MedSouth | 25% |
| City General | 20% |
| Riverside Hospital | 20% |

The merged entity ("MedNorth-South") argues that consolidating administrative systems and sharing equipment will generate **$60 million in annual cost savings**. Before the merger, the average price of a standard procedure is **$10,000**, and the total quantity performed annually is **50,000 procedures**. Regulators estimate that, without the efficiency gains, the merger would cause prices to rise to **$11,200** and reduce quantity to **40,000 procedures**.

**(a)** Calculate the pre-merger HHI, the ΔHHI resulting from the MedNorth-MedSouth merger, and the post-merger HHI. Based on DOJ/FTC thresholds, classify the market and state whether this merger is presumptively anticompetitive. *(10 points)*

<details>
<summary>Answer - Part (a)</summary>

**Pre-merger HHI:**

HHI_pre = 35² + 25² + 20² + 20² = 1,225 + 625 + 400 + 400 = **2,650**

**ΔHHI from the MedNorth + MedSouth merger:**

ΔHHI = 2 × 35 × 25 = **1,750**

**Post-merger HHI:**

HHI_post = 2,650 + 1,750 = **4,400**

**Classification:**
- Post-merger HHI = 4,400 → **Highly concentrated** market (above the 2,500 threshold).
- ΔHHI = 1,750 → Far exceeds the 200-point threshold for a presumption of harm.

**Conclusion:** Under DOJ/FTC guidelines, this merger is **presumptively anticompetitive**. It would be subject to close scrutiny and is very likely to be challenged unless the parties can demonstrate compelling efficiencies or timely, likely, and sufficient entry.

</details>

**(b)** Explain the **unilateral effects** concern that arises from this merger. In your answer, use the concept of the diversion ratio and explain intuitively why the merged hospital has an incentive to raise prices that did not exist before. *(8 points)*

<details>
<summary>Answer - Part (b)</summary>

Before the merger, MedNorth and MedSouth compete directly for patients in the same city. If MedNorth raises its prices, it loses some patients - and many of them will switch to MedSouth (the closest substitute, given their geographic overlap). From MedNorth's perspective, these are *lost revenues*. This competitive pressure disciplines MedNorth's pricing.

After the merger, the merged entity **internalizes this competitive externality**. If a patient switches from MedNorth to MedSouth, the merged firm still captures that revenue. It no longer "loses" when patients divert between its own hospitals. This gives the merged entity a **unilateral incentive to raise prices** - not through coordination with City General or Riverside, but simply because it no longer competes with itself.

The **diversion ratio** between MedNorth and MedSouth is the key metric here. Because these are the two closest competitors (together holding 60% of the market), the diversion ratio is likely high - meaning a large fraction of patients who leave MedNorth would go to MedSouth. A high diversion ratio amplifies the unilateral price increase incentive.

**Key point:** Unilateral effects do not require coordination with any other firm. Even if City General and Riverside continue competing normally, MedNorth-South can profitably raise prices because it has eliminated the competitive constraint that previously kept its prices in check.

</details>

**(c)** Using the **Williamson trade-off**, calculate the allocative loss (A1) and the productive gain (A2). The $60 million in cost savings apply to the post-merger quantity of 40,000 procedures. Should regulators approve this merger on total welfare grounds? Clearly state your decision criterion. *(12 points)*

<details>
<summary>Answer - Part (c)</summary>

**Given values:**
- P₁ = $10,000, Q₁ = 50,000 (pre-merger)
- P₂ = $11,200, Q₂ = 40,000 (post-merger, no efficiencies)
- ΔP = $1,200 | ΔQ = 10,000

**Allocative Loss (A1) - the DWL triangle:**

A1 = ½ × ΔP × ΔQ = ½ × $1,200 × 10,000 = **$6,000,000**

**Productive Gain (A2) - cost savings rectangle:**

Cost savings per procedure = $60,000,000 ÷ 40,000 = $1,500

A2 = $1,500 × 40,000 = **$60,000,000**

**Decision criterion:** Approve if A2 > A1.

Since $60M >> $6M, the merger **increases total social welfare** under a total welfare standard.

**Important caveat:** Under a **consumer welfare standard** (as applied in the US), efficiencies must actually be passed through to patients as lower prices. If the merged firm captures all $60M in savings as profit while raising prices by $1,200, consumers are harmed even though total welfare improves. The efficiency defense would require the savings to be verifiable, merger-specific, and demonstrably beneficial to patients.

**Key insight on the Williamson trade-off:** A1 is a triangle (second-order: scales with ΔP²) while A2 is a rectangle (first-order: scales linearly with ΔAC). Even modest cost reductions can easily dominate large price increases - which is why efficiency defenses are economically powerful in theory, even if courts apply them skeptically in practice.

</details>

**(d)** The merging parties argue that two new hospital systems have expressed interest in entering the city within the next 3–4 years. Evaluate this entry argument using the criteria from the Horizontal Merger Guidelines. Does it defeat the competitive concern? *(10 points)*

<details>
<summary>Answer - Part (d)</summary>

The Horizontal Merger Guidelines require entry to be **timely, likely, and sufficient** to defeat a competitive concern. The parties' claim fails on multiple criteria:

**Timely?** The HMGs require entry within approximately **2 years**. The parties claim 3–4 years - outside the standard window. Hospital construction, licensing, regulatory approvals, staff credentialing, and accreditation all take years. Entry is **not timely**.

**Likely?** Entry into a hospital market requires massive sunk investment with highly uncertain patient volume returns. New entrants cannot easily gauge whether they will attract enough patients away from established, well-known brands. Entry is **not clearly likely** at pre-merger prices.

**Sufficient?** Even if two entrants eventually appear, there is no guarantee they will achieve enough scale or geographic reach to fully replace the competitive constraint lost through the MedNorth-MedSouth merger. Entry is **not clearly sufficient**.

**Conclusion:** The entry claim does **not** defeat the competitive concern. Hospital markets are characterized by very high barriers - capital intensity, regulatory requirements, brand trust - which is precisely why hospital mergers are among the most scrutinized in antitrust enforcement.

</details>

## Question 2 - Market Definition and Market Power (20 points)

**Case:** StreamMax is a company offering live, HD-quality sports streaming in an online subscription service priced at **$30 per month**. Its marginal cost of serving an additional subscriber is **$8 per month**. Regulators are investigating whether StreamMax holds monopoly power in the market.

A competing product - traditional cable sports packages - is available at **$15 per month** but does not offer live HD streaming or on-demand replay. Regulators must first determine the relevant market before assessing StreamMax's market power.

**(a)** Apply the **SSNIP test** to determine whether the relevant market should be defined as (i) "premium live sports streaming" or (ii) "all sports content services" (including cable). Walk through the test step by step for each candidate market. *(8 points)*

<details>
<summary>Answer - Part (a)</summary>

The SSNIP test asks: *Would a hypothetical monopolist of a proposed set of products profitably sustain a 5% price increase for at least one year?*

**Step 1: Test "premium live sports streaming" alone**

If a hypothetical monopolist of premium live sports streaming raised prices by 5% (from $30 to $31.50), would enough subscribers switch to cable to make the increase unprofitable?

Likely answer: **No.** Cable at $15/month is a meaningfully different product - it lacks live HD quality and on-demand replay. Consumers who specifically value these features and already pay a $15 premium over cable would not abandon StreamMax for an inferior substitute over a $1.50 price difference. The price increase is profitable.

**Conclusion:** "Premium live sports streaming" constitutes a relevant market on its own. No need to expand.

**Step 2 (confirmatory): What if we included cable?**

A 5% price increase on the broader basket would also be profitable, but the broad market is over-inclusive - it bundles products consumers treat as meaningfully different. The narrow definition is the right one: the key customer group (HD streaming subscribers) would not switch to cable even at a modest price increase.

**Market definition:** "Premium live sports streaming" is the relevant product market. Geographic market: wherever StreamMax is licensed to operate.

</details>

**(b)** Calculate StreamMax's **Lerner Index**. Interpret the result: what does it tell you about StreamMax's market power? What is the implied price elasticity of demand facing StreamMax? *(7 points)*

<details>
<summary>Answer - Part (b)</summary>

**Lerner Index:**

L = (P − MC) / P = (30 − 8) / 30 = 22/30 ≈ **0.73**

**Interpretation:** StreamMax is pricing 73% above its marginal cost - a very high markup indicating substantial market power. In perfect competition, L = 0.

**Implied price elasticity of demand:**

For a profit-maximizing firm: L = 1/|εd|

|εd| = 1 / 0.73 ≈ **1.37**

Demand facing StreamMax is relatively inelastic. A 1% price increase causes only a ~0.73% reduction in quantity demanded. This is consistent with few close substitutes - exactly what the narrow market definition reflects.

</details>

**(c)** StreamMax holds a 70% market share in the market you defined in part (a). A regulator argues this alone is sufficient to conclude StreamMax has violated **Sherman Act Section 2**. Do you agree? Explain the legal standard for monopolization and why market share and the Lerner Index, while informative, are not sufficient on their own. *(5 points)*

<details>
<summary>Answer - Part (c)</summary>

**No - market share and a high Lerner Index are not sufficient on their own.**

Under Sherman Act Section 2, illegal monopolization requires proving **two elements**:

1. **Possession of monopoly power** in the relevant market. A 70% share is suggestive, but not conclusive - the firm must also face barriers to entry sufficient to sustain this power over time.
2. **Willful acquisition or maintenance** of monopoly power through **anticompetitive or exclusionary conduct** - not through a superior product, better management, or historical accident.

**It is not illegal to be a monopoly.** If StreamMax achieved dominance by offering a product consumers genuinely prefer, and is not engaging in exclusionary conduct (e.g., predatory pricing, exclusive dealing that forecloses rivals), there is no Section 2 violation - even with L = 0.73 and 70% market share.

The Lerner Index measures outcomes (current price-cost margin), not conduct. The regulator would need to identify specific anticompetitive behavior - not just market power - before a monopolization claim can proceed.

</details>

## Question 3 - Cartel, Per Se Illegality, and Deadweight Loss (20 points)

**Case:** Three mining conglomerates - AlphaMin, BetaMine, and GammaCorp - collectively control **90% of the world's refined cobalt supply**, a critical input for electric vehicle batteries. For the past decade, the three firms have been meeting privately and coordinating their output decisions to keep prices "stable." In a perfectly competitive market, cobalt would be priced at **$20,000 per ton** with an annual quantity of **500,000 tons**. Under the cartel arrangement, the price is **$32,000 per ton** and the annual quantity supplied is **350,000 tons**.

**(a)** Is the three-firm output coordination **per se illegal** under the Sherman Act, or should it be evaluated under the **rule of reason**? Justify your answer and identify the specific provision of the Sherman Act that applies. *(5 points)*

<details>
<summary>Answer - Part (a)</summary>

The output coordination is **per se illegal** under **Sherman Act Section 1**, which prohibits "every contract, combination... or conspiracy in restraint of trade."

Output coordination among competitors is functionally equivalent to **price-fixing** - restricting supply drives up price, which is precisely the intended and achieved effect. Price-fixing (and output coordination as a variant) is one of the categories US courts have held to be **automatically illegal**, requiring no weighing of pro- and anti-competitive effects. The DOJ does not need to demonstrate actual consumer harm; the act of coordinating is sufficient for liability.

The cartel's claim that it provides "price stability" is **not a valid defense** under the per se rule. Such an argument would only be considered under the rule of reason, which applies to less obviously harmful restraints (e.g., vertical agreements, some joint ventures). For horizontal output coordination among direct competitors, the per se rule applies categorically.

</details>

**(b)** Calculate the **deadweight loss (DWL)** caused by the cartel. Draw and describe a supply-and-demand diagram that shows: (i) the competitive equilibrium, (ii) the cartel equilibrium, (iii) the area of consumer surplus transferred to producers, and (iv) the DWL triangle. *(8 points)*

<details>
<summary>Answer - Part (b)</summary>

**Given:**
- Competitive: P_c = $20,000/ton, Q_c = 500,000 tons
- Cartel: P_k = $32,000/ton, Q_k = 350,000 tons
- ΔP = $12,000 | ΔQ = 150,000

**DWL calculation:**

DWL = ½ × ΔP × ΔQ = ½ × $12,000 × 150,000 = **$900,000,000 per year**

**Diagram description:**

- Horizontal axis: Quantity (tons/year). Mark Q_k = 350,000 and Q_c = 500,000.
- Vertical axis: Price ($/ton). Mark P_c = $20,000 and P_k = $32,000.
- Downward-sloping demand curve and upward-sloping supply (MC) curve intersecting at (Q_c, P_c) - the competitive equilibrium.
- The cartel restricts output to Q_k and raises price to P_k.
- **Rectangle** between P_k and P_c, spanning 0 to Q_k: **consumer surplus transferred to producers** (a redistribution, not a welfare loss).
- **Triangle** with vertices at (Q_k, P_k), (Q_k, P_c), and (Q_c, P_c): the **deadweight loss** - welfare destroyed because mutually beneficial transactions at competitive prices no longer occur.

</details>

**(c)** Economic theory predicts that cartels are inherently unstable. Explain the core incentive problem that causes cartels to break down. Then, identify **three specific features** of this cobalt market that might make this particular cartel *more stable* than average, and explain why each feature helps. *(7 points)*

<details>
<summary>Answer - Part (c)</summary>

**Why cartels are unstable - the core problem:**

Every cartel member faces an individual incentive to **cheat**. If the cartel sets output at Q_k and price at P_k, each firm can secretly expand its own output beyond its quota and sell extra units at the high cartel price. The defector gains extra revenue while everyone else's restricted supply keeps prices elevated. However, if *all* members reason this way, supply expands, prices collapse, and the cartel disintegrates. This is a classic **prisoner's dilemma**: the collectively optimal outcome (restrict output) is individually irrational (each firm prefers to expand unilaterally).

**Three features that enhance stability in this cobalt market:**

1. **Only three members controlling 90% of supply.** With so few members, it is straightforward to monitor each firm's output volumes. Deviations are detected quickly, and punishment (reverting to competitive output and prices) is swift and credible. Fewer members = easier monitoring = stronger deterrence against cheating.

2. **High barriers to entry.** New cobalt mining requires enormous capital investment and years of development - the fourth independent producer has a small share and cannot quickly scale. Even if the cartel sustains high prices, the threat of rapid new entry disciplining those prices is limited. This lengthens the time horizon over which cartel profits can be sustained, making the arrangement worth maintaining.

3. **Inelastic demand for an essential input.** Cobalt is critical for EV batteries with few near-term substitutes. Even at $32,000/ton, manufacturers must buy it. This inelasticity means the cartel can sustain a large price-cost margin without dramatically losing volume - making the profits from coordination large and the temptation to cheat (by undercutting slightly and gaining a few extra customers) relatively weak.

</details>

## Question 4 - Conglomerate Effects and Bundling (15 points)

**Case:** AeroTech is the dominant manufacturer of aircraft navigation systems, holding a **60% worldwide market share**. PowerJet is a leading producer of commercial aircraft engines, with a **45% worldwide market share**. Neither firm competes directly with the other - their products are complements: every aircraft needs both an engine and a navigation system. AeroTech has proposed to acquire PowerJet for $30 billion. Post-merger, the combined firm plans to offer engines and navigation systems exclusively as a **bundled package** at a discount relative to purchasing them separately from different vendors.

**(a)** Explain why this merger does **not** raise traditional horizontal merger concerns. Identify the specific type of competitive harm - with its proper name - that the European Commission would be most likely to focus on in its review. *(5 points)*

<details>
<summary>Answer - Part (a)</summary>

This is **not a horizontal merger** because AeroTech and PowerJet operate in entirely different product markets - navigation systems and aircraft engines respectively. They are **complements**, not substitutes: no customer chooses between them; every aircraft needs both. There is no direct overlap in the same product-geographic market, so traditional horizontal merger analysis (HHI, unilateral effects among direct competitors) does not apply.

The European Commission would instead focus on **conglomerate effects** - specifically, **portfolio effects**. The concern is that by combining dominant positions in two complementary markets, the merged firm acquires an ability to leverage strength in each market to foreclose competitors in both, through the mechanism of **anticompetitive bundling** or tying. Rivals who supply only one of the two products cannot replicate the bundle, placing them at a structural competitive disadvantage.

</details>

**(b)** Walk through the economic logic of how the bundling strategy could, over time, **foreclose** rival navigation system makers and rival engine makers - even if, in the short run, the bundle offers a lower total price to aircraft manufacturers. What happens to competition in the long run? *(6 points)*

<details>
<summary>Answer - Part (b)</summary>

**Short run:** Aircraft manufacturers face a bundle priced at a discount. Buying AeroTech navigation + PowerJet engine together is cheaper than buying separately from RivalNav and RivalEngine. From a consumer perspective, this looks pro-competitive - prices are lower.

**The foreclosure mechanism (medium to long run):**

- As manufacturers shift purchasing to the bundle, **RivalNav loses volume**. With lower sales, RivalNav cannot spread its fixed R&D and manufacturing costs - it becomes less profitable, reduces investment, and eventually exits or is severely weakened.
- Similarly, **RivalEngine loses customers** to manufacturers who take the bundle, weakening its ability to invest in next-generation engine technology.
- Once rivals have exited or been marginalized, the merged AeroTech-PowerJet faces no meaningful competition in either market and can **raise prices on both products** - far above what it charged during the bundling period.

**Key insight:** The short-run discount is funded by the long-run elimination of competitive discipline. Rivals cannot match the bundle because they only operate in one of the two markets - RivalNav cannot discount engines, and RivalEngine cannot discount navigation systems. The bundle weaponizes the complementarity of the two products to simultaneously squeeze out competitors in both markets. The harm is not in today's price but in the future market structure that the bundling creates.

</details>

**(c)** Describe how the **US DOJ** would likely approach this case differently from the **European Commission**, and explain why the same merger might be approved in the US but blocked in Europe. *(4 points)*

<details>
<summary>Answer - Part (c)</summary>

**European Commission:** Has historically been willing to block mergers on conglomerate/portfolio effects theory even when short-run consumer prices fall. The EU looks forward and asks whether the merger creates a dominant position that *will* significantly impede effective competition in the long run. It places weight on protecting the competitive structure of the market itself - including protecting rivals' ability to compete - not only on immediate consumer prices. GE/Honeywell (2001) is the defining example: the EC blocked a merger the US had approved, primarily on portfolio effects and bundling grounds.

**US DOJ:** Applies a stricter **consumer welfare standard** focused on demonstrable, near-term harm. Bundling that produces lower prices for buyers is generally viewed as pro-competitive. US courts are skeptical of speculative long-run foreclosure theories; they require concrete evidence that rivals will actually exit and that prices will actually rise. The burden of proof for conglomerate theories is high and difficult to meet.

**Result:** The same merger can be approved in the US and blocked in the EU - precisely what happened with GE/Honeywell - because the two regimes place different weights on speculative future harm vs. observable short-run consumer benefit.

</details>

## Question 5 - Remedies (5 points)

**Case:** Regulators have completed their review of a proposed merger between the two largest cement producers in a regional market. They have determined that the merger raises significant competitive concerns: the post-merger HHI is **3,400** and the ΔHHI is **980**. The parties offer two alternative remedies:

- **Option A (Structural):** Divest one cement plant in the overlapping region to an approved independent buyer, who would become a new competitor.
- **Option B (Behavioral):** Commit to a price cap on cement for 5 years, monitored by a regulatory agency.

**(a)** Which remedy would US antitrust authorities prefer, and why? What is the key limitation of the remedy they would *not* prefer? *(5 points)*

<details>
<summary>Answer - Part (a)</summary>

**US antitrust authorities would strongly prefer Option A: the structural remedy (divestiture).**

**Why structural remedies are preferred:**

US merger enforcement philosophy favors solutions that restore competition directly in the market, rather than requiring ongoing regulatory oversight. Divesting a plant to an independent buyer creates a new, self-sustaining competitor who will independently constrain the merged firm's pricing. No regulator needs to monitor behavior year after year - the competitive structure does the work.

**Key limitations of Option B (behavioral - price cap):**

1. **Monitoring and enforcement burden:** A regulator must continuously verify that prices comply across all product varieties, regional submarkets, and contract forms. Firms can evade price caps through quality reductions, service degradation, or restructuring transactions to avoid the cap's scope.

2. **Temporary fix:** After 5 years, the cap expires. The merged firm - now with its dominant market position fully consolidated - can raise prices freely. The underlying structural harm is never addressed; the cap only suppresses its symptom.

3. **Does not restore competition:** The cap constrains the price outcome but not the cause (insufficient rivals in the market). It turns the government into a permanent quasi-regulator of a market it never intended to regulate - inefficient and prone to regulatory capture over time.

**Note:** Behavioral remedies are more commonly accepted by the European Commission, which has a stronger tradition of ongoing regulatory engagement. US authorities strongly prefer clean structural solutions wherever they are feasible.

</details>

*End of Practice Exam*