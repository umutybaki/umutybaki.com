---
title: "ECON 499 - Module 2 Practice Exam 2"
date: "2026-04-22"
description: "Practice exam covering coordinated effects, pharmaceutical market definition, cartel dynamics, vertical merger foreclosure, and the failing firm defense."
---

# ECON 499 - Module 2 Practice Exam 2

**Instructions:** This exam has 5 questions with subparts, totaling 100 points. Each question presents a short case. Analyze it using the antitrust tools covered in class. Show all steps in your reasoning and calculations. Label all graphs clearly. State any assumptions you make explicitly. You may not use a calculator - all numbers are designed to be solved by hand.

## Question 1 - Horizontal Merger with Coordinated Effects (40 points)

**Case:** Four companies dominate the enterprise software market, selling productivity suites to large corporations. Their market shares are as follows:

| Company | Market Share |
|:---|---:|
| NovaSoft | 40% |
| DataPro | 20% |
| CoreTech | 25% |
| MicroSys | 15% |

NovaSoft and DataPro have announced a merger. Industry analysts estimate that without efficiency gains, the merger would raise the average license price from **$200 per license** to **$240 per license**, and reduce annual sales from **2,000,000 licenses** to **1,500,000 licenses**. The merging parties claim the combination of their engineering teams will generate **$30 million in annual cost savings**, applied to the post-merger quantity.

Independent economists also note that the enterprise software market has historically shown signs of coordinated behavior: the four firms have very similar pricing structures, publicly announce price changes well in advance, and the market has seen no new entrant in over a decade.

**(a)** Calculate the pre-merger HHI, the ΔHHI from the NovaSoft-DataPro merger, and the post-merger HHI. Apply the DOJ/FTC thresholds and state whether this merger is presumptively anticompetitive. *(10 points)*

<details>
<summary>Answer - Part (a)</summary>

**Pre-merger HHI:**

HHI_pre = 40² + 20² + 25² + 15² = 1,600 + 400 + 625 + 225 = **2,850**

**ΔHHI:**

ΔHHI = 2 × 40 × 20 = **1,600**

**Post-merger HHI:**

HHI_post = 2,850 + 1,600 = **4,450**

**Classification:**
- Post-merger HHI = 4,450 → **Highly concentrated** market (above 2,500).
- ΔHHI = 1,600 → Far exceeds the 200-point presumption threshold.

**Conclusion:** This merger is **presumptively anticompetitive** under the DOJ/FTC Horizontal Merger Guidelines. Regulators would almost certainly challenge it absent compelling efficiencies or other mitigating factors.

</details>

**(b)** Explain the **unilateral effects** concern specific to this merger. Why does NovaSoft, as the largest firm, have a particularly strong incentive to raise prices post-merger? Use the concept of diversion ratio in your answer. *(8 points)*

<details>
<summary>Answer - Part (b)</summary>

Before the merger, when NovaSoft raises its price, it loses customers - and a significant fraction of those customers will switch to DataPro, the next-best alternative. This is the **diversion** from NovaSoft to DataPro. From NovaSoft's standpoint, these are lost revenues that discipline its pricing.

After the merger, NovaSoft-DataPro internalizes this externality. Customers who switch from the NovaSoft suite to the DataPro suite are still purchasing from the merged entity. The merged firm no longer "loses" from this diversion. It therefore has a **unilateral incentive** to raise prices on both products - without needing any coordination with CoreTech or MicroSys.

**Why is this concern especially acute for NovaSoft?** NovaSoft is the market leader with a 40% share. DataPro, at 20%, is likely its closest rival for many corporate customers. The **diversion ratio** from NovaSoft to DataPro - the fraction of NovaSoft customers who would switch to DataPro upon a price increase - is likely high. The higher the diversion ratio, the greater the price increase incentive. Because NovaSoft already commands the largest share and the merger eliminates its most significant competitive constraint, the unilateral effect here is stronger than it would be for a merger between two smaller fringe firms.

</details>

**(c)** Using the **Williamson trade-off**, calculate the allocative loss (A1) and the productive gain (A2) from the merger. Should regulators approve this merger on total welfare grounds? *(12 points)*

<details>
<summary>Answer - Part (c)</summary>

**Given values:**
- P₁ = $200/license, Q₁ = 2,000,000 licenses (pre-merger)
- P₂ = $240/license, Q₂ = 1,500,000 licenses (post-merger, no efficiencies)
- ΔP = $40 | ΔQ = 500,000

**Allocative Loss (A1) - DWL triangle:**

A1 = ½ × ΔP × ΔQ = ½ × $40 × 500,000 = **$10,000,000**

**Productive Gain (A2) - cost savings rectangle:**

Cost savings per license = $30,000,000 ÷ 1,500,000 = $20/license

A2 = $20 × 1,500,000 = **$30,000,000**

**Decision criterion:** Approve if A2 > A1.

Since $30M > $10M, the merger **improves total social welfare** under a total welfare standard.

**However**, two important caveats:

1. Under a **consumer welfare standard**, regulators would require that the $20/license cost saving be passed through to buyers as lower prices - not captured entirely by shareholders. If prices rise to $240 while costs fall, consumers are harmed even though total welfare improves.

2. The efficiency claims must be **merger-specific** (not achievable without the merger) and **verifiable**. Software development collaboration could potentially occur through a joint venture or licensing agreement without a full merger - regulators would scrutinize this.

</details>

**(d)** Beyond unilateral effects, explain why this market is particularly vulnerable to **coordinated effects** post-merger. Identify at least **three market features** from the case facts that facilitate coordination, and explain what regulators should watch for. *(10 points)*

<details>
<summary>Answer - Part (d)</summary>

**What are coordinated effects?**

Coordinated effects arise when a merger does not necessarily enable the merged firm to raise prices alone, but restructures the market in a way that makes tacit or explicit collusion among *all remaining firms* easier to sustain. Even without a formal agreement, firms may coordinate by observing each other's pricing and matching moves - a practice known as tacit collusion.

**Three features of this market that facilitate coordination:**

1. **Highly concentrated market post-merger (HHI = 4,450, 3 effective firms).** With only CoreTech and MicroSys remaining alongside NovaSoft-DataPro, there are very few firms to monitor. Each firm can observe the others' behavior and quickly detect if anyone undercuts. Detection and punishment are swift, making deviation less attractive.

2. **Public advance pricing announcements.** The case states that firms announce price changes well in advance. This is a classic facilitating practice for tacit collusion - it allows competitors to "signal" pricing intentions, observe whether rivals will match, and coordinate on a common price without ever communicating directly. Post-merger, with one fewer independent price-setter, this signaling dynamic becomes more powerful.

3. **No new entry in over a decade.** High entry barriers mean that even if the three remaining firms successfully coordinate on elevated prices, new competitors are unlikely to undercut them. The threat of entry is the main force that disciplines coordinated pricing in concentrated markets. Without it, coordination can persist indefinitely.

**What regulators should watch for:** Post-merger, regulators should monitor for parallel pricing behavior, unusually stable market shares, and reduction in innovation or product differentiation - all signs that tacit coordination is occurring even without explicit communication.

</details>

## Question 2 - Pharmaceutical Market Definition and Market Power (20 points)

**Case:** PatentRx is the sole manufacturer of ArthroFix, a patented prescription drug for rheumatoid arthritis. PatentRx sells ArthroFix at **$80 per pill** with a marginal cost of **$20 per pill**. A generic alternative (MethoRel) is available from multiple manufacturers at **$25 per pill**, but it requires a different prescription and has a slightly different side-effect profile. Physicians prescribe both drugs, but many patients are locked into one or the other based on their treatment history.

Regulators are deciding whether to investigate PatentRx for monopolization and must first define the relevant market.

**(a)** Apply the **SSNIP test** to determine whether the relevant market is (i) "ArthroFix specifically" or (ii) "all rheumatoid arthritis treatments." Consider both demand-side and supply-side substitution in your answer. *(8 points)*

<details>
<summary>Answer - Part (a)</summary>

The SSNIP test asks: *Would a hypothetical monopolist of a proposed product set profitably sustain a 5% price increase for at least one year?*

**Step 1: Test "ArthroFix specifically" as the market**

If a hypothetical monopolist of ArthroFix raised its price by 5% (from $80 to $84), would enough patients switch to MethoRel to make the increase unprofitable?

Key considerations:
- **Demand-side (patients):** Many patients are locked into ArthroFix based on treatment history and physician recommendation. A $4 price change is small relative to the existing $55 price gap between ArthroFix ($80) and MethoRel ($25). Insurance coverage further insulates patients from direct price signals. Most patients would **not** switch.
- **Supply-side (other manufacturers):** Generic manufacturers already produce MethoRel but cannot produce ArthroFix - it is protected by a patent. No supply-side substitution is possible.

**Conclusion from Step 1:** A 5% price increase is likely profitable. "ArthroFix specifically" is already a relevant market - the narrow definition holds.

**Step 2 (confirmatory): What about "all rheumatoid arthritis treatments"?**

This broader market includes MethoRel and other treatments. Even at the broader level, PatentRx controls only ArthroFix and has no ability to constrain MethoRel pricing. The broader market is over-inclusive and would inappropriately dilute PatentRx's measured market power.

**Market definition:** The relevant product market is **"ArthroFix" (or equivalently: this specific patented branded drug)**. The geographic market is wherever PatentRx holds its patent and sells - typically national.

</details>

**(b)** Calculate PatentRx's **Lerner Index**. Interpret the result and calculate the implied price elasticity of demand. Is this level of market power consistent with the market definition you chose in part (a)? *(7 points)*

<details>
<summary>Answer - Part (b)</summary>

**Lerner Index:**

L = (P − MC) / P = (80 − 20) / 80 = 60 / 80 = **0.75**

**Interpretation:** PatentRx prices 75% above its marginal cost - very high market power. In a perfectly competitive market L = 0; for a monopoly, L approaches 1. A Lerner Index of 0.75 reflects a firm facing very inelastic demand with few close substitutes - consistent with the narrow market definition established in part (a).

**Implied price elasticity:**

For a profit-maximizing firm: L = 1/|εd|

|εd| = 1/0.75 = **1.33**

Demand is relatively inelastic: a 1% price increase leads to only a ~0.75% decrease in quantity demanded. This confirms that ArthroFix patients have few good substitutes and are unlikely to leave even at elevated prices - consistent with patients being locked in by prescriptions and treatment history.

**Consistency check:** A Lerner Index of 0.75 in a market defined narrowly as "ArthroFix only" is internally consistent. If we had defined the market broadly as "all arthritis treatments," PatentRx's market share would be much smaller and the Lerner Index would seem anomalously high - a signal that the broad market definition was incorrect.

</details>

**(c)** A regulator argues that PatentRx's Lerner Index of 0.75 and dominant market share are sufficient to bring a **Sherman Act Section 2** monopolization case. A PatentRx attorney responds: *"We obtained our patent through legitimate R&D investment - we have done nothing wrong."* Who is correct? Explain the legal standard and the role of patents in antitrust analysis. *(5 points)*

<details>
<summary>Answer - Part (c)</summary>

**The attorney is substantially correct, but the answer requires nuance.**

Under Sherman Act Section 2, illegal monopolization requires **two elements**:

1. **Possession of monopoly power** in the relevant market.
2. **Willful acquisition or maintenance of that monopoly power through anticompetitive or exclusionary conduct** - not through superior product, legitimate R&D, or historical accident.

**Patents are a legally sanctioned form of monopoly.** The US patent system deliberately grants inventors a temporary exclusive right to commercialize their invention in exchange for public disclosure. Charging a high price during a patent term is the intended reward for R&D investment - it is not anticompetitive conduct. The law does not penalize a firm for having market power if that power was obtained through legitimate means.

**However**, the attorney's argument is not an absolute shield. PatentRx could still face Section 2 liability if it is found to have:
- Obtained the patent through fraud on the patent office.
- Engaged in "product hopping" or other tactics to extend monopoly beyond the legitimate patent term.
- Used exclusionary contracts to block generic entry after the patent expires.

**Conclusion:** Market power alone - even very substantial market power - does not constitute illegal monopolization. The regulator would need to identify specific anticompetitive *conduct*, not merely point to a high Lerner Index or market share.

</details>

## Question 3 - Cartel Dynamics and Welfare Analysis (20 points)

**Case:** Four companies - Apex, Borealis, Centrex, and DeltaMine - together control **85% of the global supply of neodymium**, a rare earth mineral essential for electric motors and wind turbines. For the past eight years, the four firms have held quarterly "industry association" meetings, during which they have coordinated their production volumes to maintain a stable price. In a fully competitive market, neodymium would trade at **$50,000 per ton** with an annual global quantity of **200,000 tons**. Under the current coordinated arrangement, the price is **$75,000 per ton** and the annual quantity is **140,000 tons**.

**(a)** A defense attorney for the firms argues their meetings qualify as a legitimate "industry association" for sharing technical standards and should be evaluated under the **rule of reason**. Do you agree? Identify the relevant law and the correct standard of review. *(5 points)*

<details>
<summary>Answer - Part (a)</summary>

**No - the defense attorney's characterization is incorrect.**

The output coordination described - four competing firms meeting to agree on production volumes that keep prices elevated - is functionally identical to **price-fixing**. Restricting supply to raise price is the mechanism; the cartel label on the meeting ("industry association") does not change the economic substance of the agreement.

Under **Sherman Act Section 1**, this constitutes a "contract, combination, or conspiracy in restraint of trade" among horizontal competitors. Horizontal price-fixing and output coordination are **per se illegal** - courts treat them as automatically unlawful without any need to weigh pro-competitive justifications. The per se rule applies because these practices have been found to be so consistently harmful and so devoid of legitimate pro-competitive benefits that case-by-case analysis is unnecessary.

The rule of reason applies only to restraints with plausible efficiency justifications and ambiguous competitive effects (e.g., certain joint ventures, some vertical agreements, ancillary restraints). A naked output-fixing agreement among direct competitors in the same market does not qualify.

**Applicable law:** Sherman Act Section 1. Standard of review: **per se illegal**.

</details>

**(b)** Calculate the **deadweight loss** caused by the cartel arrangement. Describe the diagram you would draw on an exam to illustrate the full welfare effects, including what is transferred and what is destroyed. *(8 points)*

<details>
<summary>Answer - Part (b)</summary>

**Given:**
- Competitive: P_c = $50,000/ton, Q_c = 200,000 tons
- Cartel: P_k = $75,000/ton, Q_k = 140,000 tons
- ΔP = $25,000 | ΔQ = 60,000 tons

**DWL calculation:**

DWL = ½ × ΔP × ΔQ = ½ × $25,000 × 60,000 = **$750,000,000 per year**

The cartel destroys $750 million of social welfare annually.

**Diagram description (draw this on the exam):**

- Horizontal axis: Quantity (tons/year). Mark Q_k = 140,000 and Q_c = 200,000.
- Vertical axis: Price ($/ton). Mark P_c = $50,000 and P_k = $75,000.
- Draw a downward-sloping demand curve and an upward-sloping MC (supply) curve intersecting at the competitive equilibrium (Q_c, P_c).
- The cartel restricts output to Q_k, raising price to P_k.
- **Large rectangle** between P_k and P_c, spanning 0 to Q_k: this is **consumer surplus transferred to producers** - a distributional loss for consumers but not a social welfare loss (one party gains what the other loses).
- **Triangle** with vertices at (Q_k, P_k), (Q_k, P_c), and (Q_c, P_c): this is the **deadweight loss** - transactions that would have been mutually beneficial at the competitive price no longer occur. This is the true social welfare destruction: $750 million per year.

**Note:** The transfer rectangle is typically much larger than the DWL triangle. This is why antitrust cases often focus on the distributional harm to consumers (the transfer) in political discourse, even though the DWL is the measure of pure efficiency loss.

</details>

**(c)** The four firms have maintained this arrangement for eight years without a breakdown. This is surprisingly stable for a cartel. Identify **three features** of the neodymium market that explain this stability, and then explain what economic shock or event would be most likely to destabilize the cartel. *(7 points)*

<details>
<summary>Answer - Part (c)</summary>

**Why cartels normally break down:**

Each cartel member has a private incentive to produce more than its quota and sell extra units at the elevated cartel price. If one firm defects, it profits at the others' expense. But if all firms defect simultaneously, supply rises, prices collapse to competitive levels, and everyone is worse off. This prisoner's dilemma creates inherent instability.

**Three features that have sustained this cartel for eight years:**

1. **Only four firms controlling 85% of supply.** With so few members, each firm can monitor the others' output closely (neodymium is a physical commodity with observable production volumes and export data). Deviations are detected quickly, punishment (reverting to competitive output) is swift, and the threat is credible. This monitoring advantage is why cartels with fewer members tend to last longer.

2. **Inelastic global demand.** Neodymium is essential for electric motors and wind turbines with no near-term substitute at scale. Even at $75,000/ton, buyers must purchase. This means the cartel captures a large price-cost margin without losing much volume - making the profits from coordination very large. The larger the cartel surplus, the stronger the incentive for each member to maintain the arrangement rather than defect.

3. **Significant entry barriers.** Rare earth mining requires enormous capital, geological access, and years of regulatory permitting. The remaining 15% of the market is fragmented and cannot scale rapidly. New entrants cannot quickly discipline cartel prices, extending the time horizon over which the arrangement remains profitable and worth maintaining.

**What would most likely destabilize the cartel:**

A **major technology breakthrough** creating a viable substitute for neodymium in electric motors (e.g., a new ferrite magnet or alternative motor design) would make demand highly elastic - small price increases would cause large volume losses. This would simultaneously shrink the cartel's profit from coordination and increase the temptation to defect and undercut rivals to maintain volume. Alternatively, a **secret defection discovered too late** by the other members could trigger a price war and collapse - especially if one member had capacity to dramatically expand output.

</details>

## Question 4 - Vertical Merger and Foreclosure (15 points)

**Case:** ContentCo is a major film and television studio that produces approximately **45% of the premium scripted content** licensed to streaming platforms in the country. StreamPlus is a leading streaming platform with a **35% share** of the streaming subscription market. ContentCo and StreamPlus operate at different levels of the supply chain: ContentCo is the upstream content producer; StreamPlus is the downstream distributor. They have announced a merger.

Rivals include ScreenVault and FilmHouse (competing studios) and WatchNow and ViewAll (competing streaming platforms). Currently, ContentCo licenses its content to all streaming platforms, including WatchNow and ViewAll.

**(a)** Explain why this merger is **not** primarily a horizontal merger concern. Identify the type of competitive harm it raises, and name the two specific channels through which that harm could occur. *(5 points)*

<details>
<summary>Answer - Part (a)</summary>

This is **not a horizontal merger** because ContentCo and StreamPlus do not compete in the same market - one produces content (upstream) and the other distributes it (downstream). They are in a **vertical** relationship: ContentCo supplies something StreamPlus needs.

The relevant type of harm is **vertical foreclosure** - the concern that a vertically integrated firm will use its position across the supply chain to disadvantage rivals at one or both levels, reducing competition without any direct horizontal overlap.

Two specific foreclosure channels:

1. **Input foreclosure (upstream harm):** Post-merger, the combined ContentCo-StreamPlus may withhold ContentCo's premium content from rival platforms (WatchNow, ViewAll) or offer it on worse terms (higher prices, exclusivity restrictions). This weakens rival platforms' ability to attract subscribers, potentially driving them out of the market or reducing their competitive effectiveness.

2. **Customer foreclosure (downstream harm):** Post-merger, StreamPlus may prefer ContentCo content exclusively and stop licensing content from rival studios (ScreenVault, FilmHouse). This deprives competing studios of a major distribution channel, undermining their ability to reach subscribers and recover content production costs.

</details>

**(b)** Walk through the **input foreclosure mechanism** in detail. Under what conditions would the merged firm actually find it profitable to withhold ContentCo's content from rival platforms? What is the long-run competitive harm? *(6 points)*

<details>
<summary>Answer - Part (b)</summary>

**Would the merged firm actually withhold content?**

Pre-merger, ContentCo earns licensing revenue from *all* platforms - it is profitable to license broadly. Post-merger, the merged entity faces a trade-off:

- **Benefit of withholding:** Rival platforms (WatchNow, ViewAll) lose access to highly valued content. Some of their subscribers switch to StreamPlus to get ContentCo's shows. StreamPlus gains subscribers and subscription revenue.
- **Cost of withholding:** ContentCo loses the licensing fees it would have collected from WatchNow and ViewAll.

Withholding is profitable when the **subscriber gains to StreamPlus exceed the lost licensing fees from rivals**. This is more likely when:
- ContentCo's content is highly valued and not easily substitutable (no rival studio can fill the gap quickly).
- StreamPlus's subscription margin is high (each new subscriber is very profitable).
- Rivals' demand for the content is inelastic (they would pay a lot to keep it).

**Long-run competitive harm:**

If WatchNow and ViewAll cannot offer ContentCo's content, they become less attractive to subscribers and lose market share. Over time, they may exit or be severely weakened. Once rival platforms are diminished, StreamPlus faces less competition and can raise subscription prices. Meanwhile, ScreenVault and FilmHouse - deprived of StreamPlus as a distribution channel - may also be weakened. The merged entity ultimately gains pricing power at *both* levels of the market: subscribers face higher prices, and content producers face a dominant buyer (monopsony) paying lower licensing rates.

</details>

**(c)** A US regulator is reviewing this merger. Name **one structural remedy** and **one behavioral remedy** that could address the foreclosure concern, and briefly evaluate the strengths and weaknesses of each. *(4 points)*

<details>
<summary>Answer - Part (c)</summary>

**Structural remedy: Require ContentCo to divest (sell off) its content licensing division to an independent entity.**

- *Strength:* Permanently removes the incentive to withhold content from rival platforms - the independent licensing division has no reason to favor StreamPlus. Self-enforcing; no ongoing monitoring needed.
- *Weakness:* Potentially destroys the efficiency rationale for the merger (if the vertical integration was meant to coordinate content investment with distribution). Divestiture may not be commercially feasible if ContentCo's content and StreamPlus are operationally intertwined.

**Behavioral remedy: Require the merged firm to continue licensing ContentCo's content to all rival platforms on non-discriminatory terms (a "must-offer" or "equal access" obligation).**

- *Strength:* Preserves the merger's potential efficiencies (coordinated content production and distribution) while preventing foreclosure. Less disruptive than a divestiture.
- *Weakness:* Requires ongoing regulatory monitoring - the merged firm may comply formally while degrading content quality for rivals, delaying licensing negotiations, or finding other ways to disadvantage rivals that are hard to detect. Behavioral remedies are inherently difficult to enforce in dynamic markets where content deals are complex and individualized.

</details>

## Question 5 - The Failing Firm Defense (5 points)

**Case:** Two regional airlines - SkyStar (35% market share on overlapping routes) and AirBridge (20% market share) - have proposed a merger. The combined entity would face only one other significant competitor, CoastAir (30%), on most routes, with the remainder fragmented among small carriers.

AirBridge's management argues that the airline has been losing money for three consecutive years, has been unable to secure new financing, and will be forced into bankruptcy and liquidation within six months if the merger does not proceed. They claim that without the merger, AirBridge's routes and slots would simply disappear - so the merger causes no additional harm relative to the counterfactual.

Regulators are skeptical. The post-merger HHI on the most concentrated route is 5,800 with a ΔHHI of 1,400.

**(a)** Explain the **failing firm defense** - what must a merging party prove for it to succeed? Apply each requirement to AirBridge's situation and conclude whether the defense is likely to prevail here. *(5 points)*

<details>
<summary>Answer - Part (a)</summary>

**The failing firm defense** allows an otherwise anticompetitive merger to proceed if the target firm would imminently exit the market regardless, making the merger's harm to competition illusory - competition would be lost anyway.

Under US merger guidelines, the defense requires proving **three elements**:

1. **The failing firm is unable to meet its financial obligations and cannot reorganize successfully under bankruptcy law.** AirBridge claims 3 years of losses and inability to secure financing - this is plausible but not conclusive. Regulators would examine whether a Chapter 11 reorganization (restructuring debts while continuing operations) is genuinely impossible. Airlines have successfully emerged from bankruptcy before (United, American, Delta). The bar here is high: mere financial distress does not qualify - the firm must be truly beyond rescue.

2. **The failing firm has made good-faith efforts to find an alternative, less anticompetitive acquirer and has failed.** AirBridge must show it tried to sell to a buyer who would preserve more competition (e.g., a buyer without overlapping routes) and could not find one. If SkyStar is the only bidder, regulators would want evidence that other potential buyers were contacted and declined. If AirBridge went straight to SkyStar without exploring alternatives, the defense fails on this prong.

3. **The firm's assets would exit the market absent the merger** - i.e., the routes, slots, and planes would not be acquired by another competitor who would continue to provide competitive service. If CoastAir or another carrier could acquire AirBridge's airport slots and operate the routes, competition would not be lost. The key asset here is **airport slots** - a scarce resource that a rival could realistically acquire and use competitively.

**Conclusion:** The failing firm defense is **likely to face significant skepticism** here. Given the post-merger HHI of 5,800 and ΔHHI of 1,400, the stakes are high. Regulators would scrutinize whether bankruptcy reorganization was truly impossible, whether less anticompetitive buyers were genuinely pursued, and - most importantly - whether AirBridge's airport slots would actually exit the market or simply transfer to a less anticompetitive operator. If CoastAir or a new entrant could absorb the slots, the defense fails on prong three, and the merger would be blocked despite AirBridge's financial distress.

</details>

*End of Practice Exam 2*