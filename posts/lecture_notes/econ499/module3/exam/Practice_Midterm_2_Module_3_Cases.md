---
title: Practice Midterm 2 - Module 3 Cases
date: 2026-05-21
description: Second practice midterm on the four Module 3 cases, approaching each from new angles, with analytical why-questions and collapsible model answers.
---

# Practice Midterm 2 - Module 3 Cases

## How to Use This Practice Exam

This is a second pass over the same four cases as Practice Midterm 1, but the questions attack them from **different angles** - so doing both gives broad coverage. As the syllabus states, the real exam rewards **reasoning, framing, evidence evaluation, and clear argument**, not recall.

- Designed for about **75 minutes**. Total: **120 points**.
- Each question hides a **model answer** in a callout - in Obsidian, **click the bar to reveal it**. Always attempt your own answer first.
- Strong answers **name the concept, apply it to the case, and admit the trade-off**.
- The italic line under each question names the exam skill being trained.

| Part | Case | Points |
| :--- | :--- | ---: |
| 1 | Pricing the EpiPen | 25 |
| 2 | The Elevator Saga | 27 |
| 3 | Liconsa and Social Assistance for Milk | 26 |
| 4 | The Effects of Rice Subsidies in Thailand | 22 |

## Part 1 - Pricing the EpiPen

**Q1 (13 pts).** Why does widespread health insurance tend to *raise* the equilibrium price of a drug like the EpiPen? Identify the underlying principal-agent or moral-hazard mechanism, and say who ultimately bears the cost.

*Tests: explaining a market distortion and tracing who pays.*

> [!success]- Model answer
> In a normal market the **consumer is also the payer**, so a seller who charges too much loses sales - price discipline works. Health insurance **breaks that link**.
>
> - The **patient consumes** the drug, but the **insurer pays** the bill, and an employer or the government funds the insurer.
> - The decision-maker therefore **does not feel the price**, so demand becomes **insensitive to price** - a **moral hazard** in insurance and a **principal-agent** problem (the agent choosing the drug is not the party paying).
> - With demand made inelastic, sellers can **raise list prices** with little loss of volume.
>
> Who pays: the cost is spread to **all insured people through higher premiums**, and - because over 40% of U.S. children are on **Medicaid or CHIP** - onto **taxpayers**. The uninsured, with no third party, feel the full list price directly. The high price does not vanish; it is shifted onto premium-payers and the public budget.

**Q2 (12 pts).** Martin Shkreli defended Mylan by noting it earned only an 8.9% net profit margin, so it was "not gouging." Critique this defense. Why is the figure misleading?

*Tests: critically evaluating a quantitative claim.*

> [!success]- Model answer
> The defense is misleading because it uses the **wrong unit of analysis**.
>
> - **8.9% is the company-wide net margin**, blending Mylan's many low-margin generic products with the EpiPen.
> - The relevant figure is the **product-level economics of the EpiPen**: a price around USD 300 per pen against a marginal cost of about USD 1-2 - a product gross margin near **99%**.
> - A company-wide average **hides** an extremely profitable single product. A firm can show a modest overall margin while one product is priced enormously above its cost.
>
> Also, net margin reflects choices like heavy **marketing spend** (Mylan's selling and administrative expense far exceeds its R&D) and **interest** on debt - costs the firm chose, which do not show that the EpiPen price tracks the EpiPen's cost. The correct test is **price versus marginal cost for that product**, and on that test the markup is extreme.

## Part 2 - The Elevator Saga

**Q3 (13 pts).** Using the second-price (Vickrey) auction analogy, explain why pledging your true value is a dominant strategy in the pivot mechanism. Why is "dominant strategy" a stronger property than "best response"?

*Tests: explaining a mechanism-design result precisely.*

> [!success]- Model answer
> In a **second-price auction** the highest bidder wins but pays the **second-highest bid**. Because your bid decides **whether you win** but not **how much you pay**, shading your bid cannot lower your price - it can only make you lose something you wanted or win something you did not. So **bidding your true value is optimal**.
>
> The pivot mechanism copies this split:
>
> - Your **pledge decides whether the elevator is built**, but you pay a **fixed fair share**, not your pledge - so your pledge cannot change your own bill.
> - If your pledge is **pivotal**, the **penalty** makes you pay exactly the cost you imposed on others.
> - Overstating risks tipping an inefficient build (you pay for something worth less to you); understating risks tipping an inefficient rejection (you pay a penalty). Pledging b = v avoids both.
>
> **Dominant strategy** means truth-telling is best **no matter what everyone else does** - you need no belief about others' pledges. That is far stronger than a **best response**, which is only optimal **given** a specific guess about others. Dominance is what makes the mechanism robust.

**Q4 (14 pts).** A second-floor homeowner *dislikes* the elevator because of noise: his value is v = -EUR 500. His fair share is f = EUR 2,050, and everyone else pledges a total of B_other = EUR 72,300. Should the mechanism allow him to pledge a negative number? If he pledges honestly, what happens, and is honesty still his best move? Show your work.

*Tests: handling an edge case and verifying incentive compatibility.*

> [!success]- Model answer
> Yes - **negative pledges should be allowed**. A homeowner who is harmed by the elevator has a genuine negative value, and the mechanism stays efficient only if it can hear "I want this *not* built."
>
> Honest pledge: b = v = -EUR 500.
>
> - Total B = B_other + b = 72,300 - 500 = **EUR 71,800**. Since 71,800 is below 72,000, the **elevator is not built**.
> - Pivotal test: B - b + f = 71,800 - (-500) + 2,050 = **EUR 74,350**, which is above 72,000 while B is below it - opposite sides, so **he is pivotal** in killing the elevator.
> - Penalty: F_other = 72,000 - 2,050 = 69,950. Penalty = B_other - F_other = 72,300 - 69,950 = **EUR 2,350**.
> - Payoff = 0 (not built) - 2,350 = **-EUR 2,350**.
>
> Is honesty still best? Check the alternatives:
>
> - If he pledged his fair share (EUR 2,050): B = 74,350, the elevator is built, he is not pivotal, he pays f = 2,050, payoff = v - f = -500 - 2,050 = **-EUR 2,550**.
> - If he pledged 0: B = 72,300, built, not pivotal, pays 2,050, payoff = **-EUR 2,550**.
>
> Honesty (-2,350) **beats both** alternatives (-2,550). So even for someone who is harmed, **truthful pledging remains the dominant strategy**.

## Part 3 - Liconsa and Social Assistance for Milk

**Q5 (13 pts).** Decompose the effect of the milk price subsidy on a family into an income effect and a substitution effect. Why is the substitution effect called the "distortion"? Under what condition is that distortion small?

*Tests: applying consumer theory to a real policy.*

> [!success]- Model answer
> A price subsidy lowers the price of milk. Its effect splits into two parts:
>
> - **Income effect**: the lower price makes the family effectively **richer**, so it buys more of all normal goods, including milk.
> - **Substitution effect**: milk is now **cheaper relative to other goods**, so the family **substitutes toward milk**.
>
> A **cash transfer produces only the income effect**; a **price subsidy produces both**. The **substitution effect is the distortion** because it pushes the family to consume milk that it values at **less than milk's true (unsubsidized) resource cost** - a **deadweight loss**. An equal-cost cash transfer avoids it.
>
> The distortion is **small when the family is inframarginal** - that is, when it would have bought at least the subsidized allotment **even at the full price**. For those units the subsidy is just a pure income transfer, with no behavior change. The **4-liter-per-week cap** helps by keeping much of the benefit on inframarginal units.

**Q6 (13 pts).** Why are the Progresa (Oportunidades) cash grants made *conditional* on school attendance and clinic visits rather than unconditional? Why did the government's decision to assign communities to the program at random matter for evaluating it?

*Tests: justifying program design and judging evidence quality.*

> [!success]- Model answer
> **Why conditional**: a pure cash transfer fixes current poverty but does not guarantee that families **invest in their children's human capital**. Poor families may under-invest in schooling and health because of credit constraints, short time horizons, or because the person controlling the cash is not the one who benefits. The **conditions** keep the flexibility of cash but **steer behavior** toward the specific under-provided investments - education and health. The grants are even scaled (larger for higher grades and for girls) to offset the **opportunity cost** of staying in school.
>
> **Why random assignment matters**: by **randomly assigning communities** to Progresa, the government created a **randomized controlled trial**. Random assignment makes the treated and untreated groups **comparable in every other respect**, so the measured differences (0.7 extra years of schooling, about 8% higher lifetime earnings, 12% fewer illnesses, no fall in adult labor) can be read as **caused by the program**, not as mere correlation. It turns the evaluation into credible **causal evidence**.

## Part 4 - The Effects of Rice Subsidies in Thailand

**Q7 (11 pts).** Why is a price floor unsustainable unless someone buys up the surplus? Why does the resulting over-production count as a deadweight loss?

*Tests: explaining the mechanics and welfare effect of a price support.*

> [!success]- Model answer
> A binding price floor sets the price **above equilibrium**, so **quantity supplied exceeds quantity demanded** - there is a **surplus**. If nothing else happens, sellers competing to offload that surplus would **bid the price back down** to equilibrium and the floor would collapse. The floor can hold **only if a buyer removes the surplus** - in Thailand, the **government** became the buyer of last resort and stockpiled the excess rice.
>
> **Why over-production is a deadweight loss**: the support price Ps pulls farmers to expand output until their **marginal cost equals Ps**. But the extra units are only worth the **world price Pw** to buyers. Society spends real resources (land, water, labor, fertilizer) producing rice worth **less than it cost** - that gap is pure waste. The loss on the extra output is roughly the triangle `1/2 x (Ps - Pw) x (extra quantity)`, on top of storage, spoilage, and resale losses.

**Q8 (11 pts).** Thailand's rice scheme lost enormous sums of public money, yet it was politically popular and hard to stop. Using the idea of concentrated benefits and diffuse costs, explain why a fiscally ruinous policy can still be politically durable.

*Tests: applying public-choice reasoning to government failure.*

> [!success]- Model answer
> This is a classic **government failure** explained by **public-choice theory**.
>
> - The **benefits are concentrated** on farmers - a large, well-organized group, **over-represented** in the voting system because rural districts are weighted heavily, and backed by lobbyists. Each farmer gains a lot, so each has a **strong incentive to defend** the policy and to vote on it.
> - The **costs are diffuse** - spread thinly across millions of taxpayers. Each individual loses only a little, so **no one has an incentive to organize** against it; the cost is barely noticed.
>
> This asymmetry means politicians face **loud, organized pressure to keep** the policy and only **quiet, unorganized pressure to end** it. Add **vote-buying** (the scheme was launched to win the 2011 election) and **rent-seeking** by the agricultural lobby, and an inefficient, money-losing policy becomes politically **durable** - until a fiscal or political crisis (here, a coup) forces the issue.

## Part 5 - Synthesis

These questions are unweighted and are the full-length, syllabus-style items - practice writing complete, structured arguments.

**Q9 (open, ~12 min).** For **any two** of the four cases, state whether government intervention was the **cure** for a market failure or itself the **cause** of the problem, and explain.

*Tests: classifying interventions and structured comparison.*

> [!success]- Model answer
> The four cases deliberately span the range:
>
> - **EpiPen - market failure, intervention largely absent.** The failure is **monopoly power**; government is mostly *not* acting, and the case argues it arguably **should** (faster generic approval, importation, negotiation). Here intervention would be a **cure**.
> - **Rice - intervention is the cause.** The price support **created** over-production, stockpiles, fiscal ruin, and environmental damage. A textbook **government failure**.
> - **Elevator - intervention as well-designed cure.** The free-rider problem would block a worthwhile public good; the **pivot mechanism** is a designed institution that **solves** it. A cure - when the design is good.
> - **Liconsa - a debatable intervention.** A price subsidy distorts choice, but it may **correct** a nutrition externality or paternalistic concern. Cure or distortion depends on whether you accept the merit-good rationale.
>
> A strong answer picks two, classifies each, and notes that the deciding factor is **institutional design**, not "intervene or not."

**Q10 (open, ~10 min).** A classmate concludes: "All four Module 3 cases show that governments should stay out of markets." Do you agree? Construct a reasoned response.

*Tests: argument construction and resisting an over-simple thesis.*

> [!success]- Model answer
> **Disagree** - the claim over-generalizes from one case (Rice).
>
> - **Rice** does show a damaging government intervention - but the lesson is that *badly designed* intervention fails, not that all intervention fails.
> - **EpiPen** shows the **opposite**: an unregulated market with monopoly power produces a socially harmful outcome (restricted access to a life-saving drug). Here *too little* government is the problem.
> - The **Elevator** shows a designed institution (the pivot mechanism) **succeeding** where the unaided market - voluntary contributions - would fail through free-riding.
> - **Liconsa** is genuinely contested, which itself refutes a blanket rule.
>
> The honest conclusion: the cases show that **markets fail in identifiable ways** (monopoly, public goods, externalities, asymmetric information) **and** that **government can fail too**. The real question the syllabus asks is not "intervene or not" but **"is this particular intervention well designed for this particular failure?"** A good answer replaces the slogan with that sharper question.
