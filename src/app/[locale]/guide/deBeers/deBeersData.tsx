import { ReactNode } from 'react'
import { TimelineItemData } from '@/components/Timeline'

const categoryColors: Record<string, string> = {
  'Origins': '#7c3aed',
  'Monopoly': '#0284c7',
  'Legal Battle': '#dc2626',
  'U.S. Law': '#2563eb',
  'Legal Risk': '#2563eb',
  'Crisis': '#ea580c',
  'Geopolitics': '#ea580c',
  'Strategy': '#059669',
  'Modern Era': '#059669',
}

function getIcon(tag: string) {
  const color = categoryColors[tag] || '#059669'
  return <div className="w-3 h-3 rounded-full" style={{ background: color }} />
}

export const era1: TimelineItemData[] = [
  {
    icon: getIcon('Origins'),
    iconGlow: categoryColors['Origins'],
    date: '1866',
    title: 'A Boy Finds a Shiny Stone',
    description: 'First diamond discovered on the Gariep (Vaal) River banks in South Africa.',
    tags: ['Origins'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1866, on the banks of the Gariep (Vaal) River in South Africa's Cape Province, a thirteen-year-old boy picked up a shiny stone. At the time, no one paid much attention. But this unremarkable moment was the spark that would ignite a global industry — and one of history's most extraordinary monopolies.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          The diamond, initially dismissed as just another rock, eventually set off a chain of events that would create the De Beers cartel, shape engagement ring culture worldwide, and generate decades of U.S. antitrust battles.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why It Matters for Antitrust Economics</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The origins of De Beers illustrate how <strong>commodity markets</strong> work before monopolization. Before the diamond rush, no single entity controlled supply. Multiple independent prospectors competed freely. In economic terms, this was close to <em>perfect competition</em> — many sellers, identical goods, price equal to marginal cost, zero economic profit.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The lesson: monopoly doesn't exist in nature. It is constructed, strategically, by people who understand how to exploit market structure. Cecil Rhodes and Ernest Oppenheimer understood this and spent decades building the structure that would give De Beers total control.</p>
      </>
    )
  },
  {
    icon: getIcon('Origins'),
    iconGlow: categoryColors['Origins'],
    date: '1869',
    title: '83.5 Carats — Diamond Fever Begins',
    description: 'A 83.5-carat diamond find ignites a rush. By 1872, 10,000 prospectors flood Kimberley.',
    tags: ['Origins'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1869, a second diamond of 83.5 carats was found — impossible to ignore. Within months, diamond fever gripped Cape Province. By 1872, roughly <strong>ten thousand prospectors</strong> had rushed to Kimberley. Five separate mines were producing gem-quality stones simultaneously.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Economic Problem This Created</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The rush created an uncoordinated, competitive market. Multiple independent producers were mining simultaneously. Diamond prices were volatile, quality was inconsistent, and underground water tables flooded the mines, making operations dangerous and expensive.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Key Economic Concept — Perfect Competition:</strong> When many independent sellers produce an identical commodity, the market tends toward <em>perfect competition</em>. Price falls to the minimum needed to keep producers in business. No individual producer has market power. Profits trend toward zero. This is exactly what diamond producers faced in 1870 — and what Cecil Rhodes decided to fix.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why Chaos Was Bad for Producers</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">With ten thousand prospectors and five competing mines, any individual producer who tried to raise prices would simply lose customers to the others. The "race to the bottom" in pricing meant that even high-quality stone producers earned thin margins. This is the fundamental problem that drives monopolization: competitive markets are great for consumers but terrible for producers seeking profit.</p>
      </>
    )
  },
  {
    icon: getIcon('Origins'),
    iconGlow: categoryColors['Origins'],
    date: '1874',
    title: 'Cecil Rhodes Arrives with a Pump',
    description: 'Rhodes brings a steam-powered water pump to Kimberley, beginning his path to total consolidation.',
    tags: ['Origins'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1874, Cecil Rhodes arrived in Kimberley with a steam-powered water pump. The mines were being flooded by underground water tables, making mining increasingly dangerous and expensive. Within a year, Rhodes was servicing <em>all</em> the mines in the region.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          "This wasn't just about solving the flooding problem; it was about centralizing control." — De Beers Case Notes
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Strategic Genius of the Pump</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">By solving a shared problem (flooding), Rhodes created <em>dependency</em>. Mine operators who relied on his pump could be influenced. More importantly, servicing all mines gave Rhodes information about their production levels, costs, and vulnerabilities — knowledge that he would eventually use to consolidate ownership.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Rhodes's Core Insight About Diamond Economics</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Rhodes recognized something fundamental: diamonds had a unique economic problem. Unlike oil or wheat, diamonds have no industrial use that creates baseline demand. Their value is almost entirely based on <strong>perceived scarcity and emotional symbolism</strong>. If supply could be kept below what markets would naturally produce, prices would stay elevated. But this required controlling <em>all</em> supply — not just some of it.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Even if Rhodes controlled 80% of production, the remaining 20% could undermine prices if those producers sold aggressively. Monopoly power requires near-total control of supply.</p>
      </>
    )
  },
  {
    icon: getIcon('Origins'),
    iconGlow: categoryColors['Origins'],
    date: '1880',
    title: 'De Beers Mining Company Founded',
    description: 'Rhodes formally establishes the De Beers Mining Company, setting the stage for monopoly.',
    tags: ['Origins'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">By 1880, Cecil Rhodes had leveraged his pump business and mining profits to formalize the <strong>De Beers Mining Company</strong>. This gave his consolidation effort a corporate identity, allowing him to raise capital, issue shares, and structure the buyout of competitors.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Corporate Structure as a Tool of Monopoly</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The formation of a formal company was strategically important. A corporation can borrow money, acquire other companies, and pursue long-term strategies that individual prospectors cannot. Rhodes used the corporate form to raise capital for aggressive acquisition — buying out competitors at prices they couldn't refuse, then reinvesting the profits to buy more.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Key Concept — Barriers to Entry:</strong> As De Beers acquired mines, it created barriers to entry for new competitors. Even if new diamonds were found, new miners would face an established, well-capitalized competitor willing to undercut prices temporarily to drive them out. The corporate form made these threats credible.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Vertical Structure of Diamond Production</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The diamond supply chain consists of: (1) Mining & Extraction → (2) Sorting & Valuation → (3) Distribution via CSO → (4) Cutting & Polishing → (5) Wholesale Trading → (6) Jewelry Manufacturing → (7) Retail Consumers. De Beers controlled stages 1, 2, and 3. This vertical control was key: owning mines without controlling distribution would have been insufficient to maintain price discipline.</p>
      </>
    )
  },
  {
    icon: getIcon('Monopoly'),
    iconGlow: categoryColors['Monopoly'],
    date: '1887',
    title: 'Rhodes Buys Out Every Competitor',
    description: 'Rhodes consolidates all major South African diamond mines under De Beers ownership — the first true diamond monopoly.',
    tags: ['Monopoly'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">By 1887 — just seven years after founding De Beers Mining Company — Cecil Rhodes had bought out <em>every other claim holder</em> in the Kimberley area. All major South African mines now operated under De Beers's ownership. The first true diamond monopoly was complete.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">How He Did It</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Rhodes used a combination of tactics: purchase of competitors at prices they couldn't refuse; leveraging mining service relationships (his pump business) to create leverage; and threatening price wars to demonstrate that resistance was costly. This is classic monopolization strategy — identify competitors, offer them a premium to sell, and if they refuse, threaten to drive them out through competitive pressure.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          Rhodes's key insight: in a commodity market with many producers, competition destroys profits for everyone. A single producer controlling all supply can raise prices and earn monopoly rents. The solution: consolidate until you're the only supplier.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Economic Theory</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Economists distinguish between <em>natural monopolies</em> (where a single firm can serve the market more efficiently than multiple firms, as in utilities) and <em>constructed monopolies</em> (where a firm achieves monopoly through acquisition and strategic action). De Beers was clearly a <strong>constructed monopoly</strong> — there was nothing natural about one firm controlling all diamond supply. It required decades of deliberate strategy.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>U.S. Law Relevance:</strong> Sherman Act Section 2 prohibits "monopolization" — acquiring or maintaining monopoly power through anticompetitive conduct. Rhodes's consolidation of all South African mines, if done in the U.S., would have been a paradigm Section 2 violation.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Monopoly'),
    iconGlow: categoryColors['Monopoly'],
    date: '1890',
    title: 'The Diamond Syndicate Formalized',
    description: 'Rhodes formalizes the Diamond Syndicate. Diamond prices rise from 18 to 32 shillings through coordinated supply control.',
    tags: ['Monopoly'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1890, Rhodes formalized what became known as the <strong>Diamond Syndicate</strong>. Merchants pledged to buy exclusively from Rhodes's mines and to sell diamonds at set prices in specific quantities. Diamond prices immediately rose from 18 to 32 shillings — not through scarcity, but through <em>coordination</em>.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">How the Syndicate Worked</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The Syndicate was a distribution control mechanism. Merchants who joined agreed to:</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>Not offer stones below an agreed price point</li>
          <li>Not sell outside their designated territories</li>
          <li>Not dump excess inventory onto the market</li>
          <li>Buy exclusively from De Beers mines</li>
        </ul>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why Price Rose 78%</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Before the Syndicate, merchants competed with each other for buyers, driving prices toward competitive levels. After the Syndicate, merchants had coordinated agreements not to undercut each other. This is textbook <strong>horizontal price-fixing</strong> — the exact conduct prohibited by Sherman Act Section 1.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Cartel Economics:</strong> The Syndicate is an example of a cartel restricting supply to raise prices. Without coordination, price = marginal cost (competitive outcome). With coordination, price = monopoly price. The difference (18 → 32 shillings = 78% increase) represents the cartel premium extracted from consumers and the quantity lost due to restriction.
        </div>
      </>
    )
  },
  {
    icon: getIcon('U.S. Law'),
    iconGlow: categoryColors['U.S. Law'],
    date: '1890',
    title: 'Sherman Act Passed — Same Year',
    description: 'U.S. Congress passes the Sherman Antitrust Act, making "every contract, combination or conspiracy in restraint of trade" illegal.',
    tags: ['U.S. Law'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In the same year that Cecil Rhodes formalized the Diamond Syndicate, the U.S. Congress passed the <strong>Sherman Antitrust Act</strong> — the foundational U.S. antitrust statute. The coincidence is historically remarkable: the cartel and the law that would eventually threaten it were born simultaneously.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Key Distinction:</strong> Section 1 requires an <em>agreement</em> between two or more parties. Section 2 applies to <em>unilateral conduct</em> by a single dominant firm. De Beers potentially violates both: Section 1 through its cartel agreements with sightholders and producers; Section 2 through its unilateral monopoly maintenance via stockpiling and exclusive dealing.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why It Didn't Apply for Decades</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The Sherman Act was designed with domestic U.S. corporations in mind. De Beers, a South African company with no U.S. presence, could argue that U.S. courts lacked jurisdiction over its operations. The Act's geographic ambiguity — it said "trade or commerce" but didn't specify domestic or foreign — created a loophole that De Beers would exploit for a century.</p>
      </>
    )
  }
]

export const era2: TimelineItemData[] = [
  {
    icon: getIcon('Monopoly'),
    iconGlow: categoryColors['Monopoly'],
    date: '1902',
    title: 'Rhodes Dies — Oppenheimer Rises',
    description: 'Cecil Rhodes dies. Ernest Oppenheimer begins his ascent to control De Beers, with an even more sophisticated vision of monopoly.',
    tags: ['Monopoly'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">When Cecil Rhodes died in 1902, he left behind a powerful but incomplete monopoly. Ernest Oppenheimer — a German-born diamond buyer who had come to South Africa to seek his fortune — gradually took control. If Rhodes built the cartel, Oppenheimer perfected it.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Oppenheimer Insight: Control Everything</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Oppenheimer's crucial insight was that controlling diamond supply wasn't enough — you had to control the <em>entire quality spectrum</em>.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The diamond market has a structure: wealthy consumers buy top-tier stones, middle-class consumers buy mid-range stones, and less affluent consumers buy smaller, lower-quality stones. If De Beers controlled only high-quality gems but let low-quality stones flood the market, the overall price structure would unravel.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          Oppenheimer also recognized that even controlling supply wasn't enough if distribution was competitive. Multiple distributors competing to buy from a single supplier would bid down the wholesale price. You needed to centralize distribution as well as supply — hence the Central Selling Organisation (CSO).
        </div>
      </>
    )
  },
  {
    icon: getIcon('U.S. Law'),
    iconGlow: categoryColors['U.S. Law'],
    date: '1914',
    title: 'Clayton Act Passed',
    description: 'U.S. Congress strengthens antitrust law. The Clayton Act prohibits even "attempts" to monopolize.',
    tags: ['U.S. Law'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1914, Congress passed the <strong>Clayton Antitrust Act</strong>, significantly broadening U.S. antitrust enforcement. Where the Sherman Act prohibited actual restraints of trade, the Clayton Act went further: it prohibited conduct that "may substantially lessen competition or tend to create a monopoly."</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Critical Addition:</strong> The Clayton Act prohibited <em>attempts</em> to monopolize — not just successful monopolization. This means De Beers's exclusive supply contracts, sightholder exclusivity arrangements, and stockpiling strategy were potentially illegal even if they hadn't fully prevented competition.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why This Mattered for De Beers</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Under the Clayton Act, De Beers's exclusive dealing arrangements with sightholders (who could only buy from De Beers and couldn't resell competitively) and with producer nations (who could only sell to De Beers) were potentially illegal as foreclosing competition. The CSO system, analyzed under Clayton Section 3, would likely be found to "substantially lessen competition" in the rough diamond distribution market.</p>
      </>
    )
  },
  {
    icon: getIcon('Monopoly'),
    iconGlow: categoryColors['Monopoly'],
    date: '1925–1929',
    title: 'Oppenheimer Seizes Total Control',
    description: 'Oppenheimer buys out the old Syndicate, completing the modern cartel with the Central Selling Organisation (CSO).',
    tags: ['Monopoly'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1925, Oppenheimer bought out the old Diamond Syndicate and replaced it with a new arrangement linked to his Anglo-American company. By 1929, he held the chairmanship of both De Beers and the Diamond Corporation. The modern De Beers cartel — with its Central Selling Organisation (CSO) as the hub — was fully operational.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">How the CSO Worked — The "Sights" System</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The CSO operated from London. Ten times per year, it held "sights" — meetings where pre-selected wholesale merchants (sightholders) were invited to purchase rough diamonds.</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>About five weeks before each sight, sightholders submitted preferences (quantity, color, quality)</li>
          <li>The CSO sorted diamonds from all sources and packed them into plain brown shoeboxes — "parcels"</li>
          <li>Sightholders could not cherry-pick: you took the entire parcel or rejected it entirely</li>
          <li>Prices were announced, not negotiated — no haggling</li>
          <li>Refusing a parcel risked losing sightholder status permanently</li>
        </ul>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Tying Arrangement:</strong> Under U.S. antitrust law, conditioning the sale of a desirable product (high-quality diamonds) on the purchase of a less desirable product (lower-quality stones in the same parcel) is called a "tying arrangement." This can be illegal under Clayton Act Section 3 if it forecloses competition in the tied market.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: '1938',
    title: 'De Beers Hires N.W. Ayer — Inventing Diamond Culture',
    description: 'De Beers hires U.S. ad agency N.W. Ayer to create demand for diamonds in America. The beginning of one of history\'s greatest campaigns.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1938, De Beers hired N.W. Ayer, a prominent U.S. advertising agency, to create demand for diamonds in the American market. This wasn't just advertising — it was a deliberate effort to construct a social institution: the diamond engagement ring.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Strategy: Manufacturing Desire</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Before De Beers's campaign, diamond engagement rings were uncommon. The company's challenge was not just to sell existing demand, but to <em>create</em> demand where little existed.</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>Associate diamonds with love, commitment, and permanence in popular culture</li>
          <li>Place diamonds in films, celebrities, and news stories</li>
          <li>Create the norm that engagement rings "should" be diamonds</li>
          <li>Establish pricing norms (e.g., "two months' salary" as the benchmark)</li>
        </ul>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Economic Significance: Demand Creation as Supply Control</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Most companies manage supply to meet demand. De Beers did something more powerful: it <em>created</em> demand through advertising. By making diamonds the symbol of love, De Beers ensured that demand would be emotionally inelastic — people wouldn't substitute rubies or sapphires for engagement rings even at higher prices. This made the cartel's supply restriction even more effective.</p>
      </>
    )
  }
]

export const era3: TimelineItemData[] = [
  {
    icon: getIcon('Legal Battle'),
    iconGlow: categoryColors['Legal Battle'],
    date: '1945',
    title: 'First DOJ Prosecution — Dismissed',
    description: 'The DOJ launches its first major prosecution of De Beers. The case is dismissed on jurisdictional grounds.',
    tags: ['Legal Battle'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Following World War II, the Roosevelt administration requested that the DOJ investigate De Beers. The resulting case centered on whether De Beers had sufficient "contacts" with the United States to be subject to U.S. jurisdiction. The case was dismissed — De Beers had successfully structured itself to be legally unreachable.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>The Minimum Contacts Doctrine</strong> (from <em>International Shoe Co. v. Washington</em>, 1945, the same year as this prosecution): A court can only assert jurisdiction over a defendant who has "minimum contacts" with the forum such that assertion of jurisdiction does not "offend traditional notions of fair play and substantial justice." De Beers's careful structuring kept it below this threshold.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Evasion Template</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">This failed prosecution established a template De Beers would use for decades: <strong>maintain no legal presence in the United States</strong>. No offices, no officers, no directors with U.S. citizenship, no sales on U.S. soil. All diamonds were sold in London to sightholders. By the time diamonds reached U.S. consumers, they were "just anonymous bundles of stones" legally divorced from De Beers.</p>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: '1947',
    title: '"A Diamond is Forever" — Slogan of the Century',
    description: 'N.W. Ayer crafts the iconic slogan, transforming engagement rings into a near-universal ritual.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1947, N.W. Ayer copywriter Frances Gerety created the line: <strong>"A Diamond is Forever."</strong> De Beers began embedding this slogan in all its advertising. Over the following decades, it would become arguably the most recognized advertising slogan ever created — and was named Slogan of the Century by Advertising Age in 2000.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Genius of the Slogan</h3>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li><strong>Durability:</strong> Diamonds don't scratch or degrade — they physically last forever, making the metaphor literally true</li>
          <li><strong>Commitment:</strong> "Forever" implied permanent romantic commitment, associating the diamond with marriage and loyalty</li>
          <li><strong>Resale prevention:</strong> If a diamond is "forever," you don't sell it. This prevented a secondary market that might have undermined new diamond prices</li>
          <li><strong>Emotional inelasticity:</strong> Once love was associated with diamond permanence, substituting another gem felt like questioning one's commitment</li>
        </ul>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          "The diamond industry spent less than 1% of revenues on advertising, while high-end whiskey spent approximately 10%. Yet De Beers achieved one of the world's most recognized brand identities. The slogan's efficiency was extraordinary."
        </div>
      </>
    )
  },
  {
    icon: getIcon('Monopoly'),
    iconGlow: categoryColors['Monopoly'],
    date: '1957',
    title: 'Ernest Oppenheimer Dies',
    description: 'Ernest Oppenheimer dies. His son Harry and later grandson Nicky carry on the family tradition of cartel management.',
    tags: ['Monopoly'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Ernest Oppenheimer died in 1957, having presided over De Beers since 1929. Under his leadership, the cartel achieved extraordinary stability: between 1902 and 1957, De Beers had only two years of financial losses (1915 and 1932). His son Harry Oppenheimer succeeded him, followed eventually by grandson Nicky Oppenheimer.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">What Made the Cartel Uniquely Stable</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Most cartels collapse within a few years. De Beers lasted over a century. The key difference: <strong>family control and patient capital.</strong></p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>The Oppenheimer family could accept years of reduced returns because they believed in long-term value</li>
          <li>No quarterly earnings pressure from institutional shareholders</li>
          <li>No activist investors demanding liquidation of stockpiles</li>
          <li>Decision-making concentrated in a family that had long-term interest in the cartel's health</li>
        </ul>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Key Insight:</strong> Most corporations cannot run a cartel because public company shareholders demand short-term profits. De Beers's family control structure was itself a barrier to entry — a public company trying to replicate De Beers's stockpiling strategy would be punished by capital markets. The cartel's persistence was partly a function of its unusual ownership structure.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Crisis'),
    iconGlow: categoryColors['Crisis'],
    date: '1960s',
    title: 'South Africa\'s Share Drops to 19%',
    description: 'New diamond sources emerge worldwide. South Africa falls to just 19% of world production. De Beers pivots to buying supply contracts.',
    tags: ['Crisis'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">By the 1960s, new diamond sources had emerged worldwide — in Siberia (USSR), central and west Africa, and elsewhere. South African diamonds, once virtually the entire world supply, fell to just <strong>19% of global production</strong> by 1960. De Beers no longer owned most of the world's diamonds.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Adaptive Strategy: From Ownership to Contractual Control</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Rather than accepting defeat, Oppenheimer's successors pivoted. De Beers offered diamond-producing countries a deal: "Sell your rough diamonds exclusively to us, at prices we set, in quantities we determine. In exchange, we guarantee you'll have a market — we'll buy during slack periods and stabilize prices."</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Most accepted: Botswana, Namibia, Angola, Tanzania, Zaire, and eventually even the Soviet Union signed exclusive supply agreements with De Beers.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          "A cartel doesn't necessarily need to own all production. It needs to <em>control</em> all production — whether through ownership, through long-term contracts, or through a combination of both."
        </div>
      </>
    )
  },
  {
    icon: getIcon('Legal Battle'),
    iconGlow: categoryColors['Legal Battle'],
    date: '1973',
    title: 'DOJ Finds U.S. Subsidiary — De Beers Divests Instantly',
    description: 'DOJ discovers De Beers owns 50% of Christensen Diamond Products. De Beers immediately divests its stake before formal proceedings begin.',
    tags: ['Legal Battle'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1973, the DOJ discovered that De Beers owned 50% of <strong>Christensen Diamond Products</strong>, an American company manufacturing diamond drill bits. This was direct U.S. business involvement — exactly what prosecutors needed to establish jurisdiction and prove U.S. market power. De Beers moved first: it rapidly divested its Christensen stake before the DOJ could initiate formal action.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Legal Judo — Preemptive Divestiture</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">This episode reveals sophisticated legal maneuvering. By divesting before formal proceedings, De Beers eliminated the jurisdictional hook. There was no longer a U.S. asset to seize, no U.S. subsidiary to serve with process, and no direct U.S. presence to establish jurisdiction.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Strategic Lesson:</strong> Sophisticated defendants can sometimes outmaneuver antitrust enforcement by acting before formal allegations arise. The DOJ can't challenge conduct that has already been reversed — and they cannot easily undo a voluntary divestiture that occurred before investigation began.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Legal Battle'),
    iconGlow: categoryColors['Legal Battle'],
    date: '1976',
    title: 'Industrial Diamond Case — De Beers Pleads No Contest',
    description: 'The DOJ\'s only partial success: industrial diamond price-fixing. De Beers Ireland pleads no contest and pays a small fine.',
    tags: ['Legal Battle'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1976, the DOJ filed both civil and criminal suits against De Beers, ANCO Diamond Abrasives, and Diamond Abrasives for <strong>price-fixing and territorial allocation</strong> in the market for diamond "grit" — industrial abrasive diamonds. De Beers Ireland and co-defendants pled no contest and paid a small fine, signing a consent decree.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          Pleading "no contest" (nolo contendere) means the defendant accepts the penalty but does not admit guilt. Crucially, a no-contest plea cannot be used as an admission in subsequent civil litigation — so De Beers's plea couldn't be used by private plaintiffs in follow-on suits.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Limits of This Victory</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">This was a narrow win for the DOJ. Industrial diamonds are a completely different market from gem diamonds. The consent decree covered only industrial diamond grit — leaving the gem diamond CSO system entirely intact. And De Beers's gem diamond operation, centered in London with no U.S. presence, remained outside the DOJ's practical reach.</p>
      </>
    )
  },
  {
    icon: getIcon('Monopoly'),
    iconGlow: categoryColors['Monopoly'],
    date: '1977',
    title: 'Israeli Sightholder Purge',
    description: 'Israeli dealers hoard diamonds trying to profit from inflation. De Beers retaliates by purging over 100 Israeli sightholders.',
    tags: ['Monopoly'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1977, during a period of high inflation, Israeli diamond dealers began hoarding diamonds — buying large quantities and holding them, betting that rising inflation would drive prices up further. This was a form of speculation that threatened the CSO's price management system. De Beers responded by <strong>purging over 100 Israeli sightholders</strong> from the system — revoking their sightholding privileges entirely.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why This Was Crucial for Cartel Maintenance</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Cartels require enforcement. The fundamental problem every cartel faces is that each member has an incentive to cheat (produce more, sell cheaper) while hoping others comply. De Beers's enforcement mechanism was the threat of exclusion from the sightholder system. Losing sightholder status meant losing access to De Beers supply — which was, essentially, losing access to the entire rough diamond market.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Cartel Theory — Punishment Mechanisms:</strong> Stable cartels typically use one or more of: (1) punitive price wars (flooding the market to punish cheaters), (2) exclusion (banning cheaters from the cartel), or (3) output controls (allocating quotas with monitoring). De Beers used all three, with sightholder exclusion being particularly powerful since De Beers controlled ~80% of supply.
        </div>
      </>
    )
  }
]

export const era4: TimelineItemData[] = [
  {
    icon: getIcon('Crisis'),
    iconGlow: categoryColors['Crisis'],
    date: '1981',
    title: 'Demand Crisis — Sales Fall 46%',
    description: 'Rising interest rates crush demand. De Beers adds a year\'s worth of diamonds to stockpile ($700M–$1B), refusing to let prices collapse.',
    tags: ['Crisis'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1981, rising interest rates and a global economic downturn crushed luxury goods demand. Diamond sales slipped <strong>46% below 1980 levels</strong>. A competitive firm would have cut prices dramatically to clear inventory. De Beers did something different: it pulled diamonds from the market and <em>added them to its stockpile</em>, spending between $700 million and $1 billion in cash reserves to absorb excess supply.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Stockpiling as a Cartel Tool</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Stockpiling allows a cartel to separate the short-term supply-demand shock from the price response. Instead of letting excess supply drive down prices, De Beers withheld supply, keeping prices stable at the cost of holding enormous inventory.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Consumer Welfare Effect:</strong> Stockpiling is harmful to consumers. In a competitive market, demand weakness leads to price decreases — consumers benefit from lower prices during recessions. Under De Beers's system, consumers never saw lower prices during downturns; price stability came at the cost of maintained supracompetitive prices.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Geopolitics'),
    iconGlow: categoryColors['Geopolitics'],
    date: '1990',
    title: '$1 Billion Loan to the Soviet Union',
    description: 'De Beers offers Gorbachev\'s government a $1 billion loan in exchange for control of Russia\'s vast diamond stockpile.',
    tags: ['Geopolitics'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">As the Soviet Union collapsed, the Gorbachev government faced financial crisis. The USSR held vast diamond reserves — in Siberia alone, it controlled a massive share of global rough diamond production. If these diamonds flooded onto the open market, diamond prices worldwide would collapse.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">De Beers offered a solution: a <strong>$1 billion loan</strong> to the Soviet government, in exchange for a significant portion of Russia's diamond stockpile and an exclusive long-term supply arrangement. De Beers would, in effect, be acting as banker to a failing superpower — with diamond supply control as collateral.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          "De Beers was, in effect, acting as a geopolitical actor, providing financial support to a failing nation-state in order to secure its diamonds and prevent them from flooding the market." — De Beers Case Notes
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why It Ultimately Failed</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The deal bought time but not permanent control. Russia would defect from the supply agreement in 1992, selling diamonds independently as its economic crisis deepened and short-term revenue needs overwhelmed long-term deal commitments.</p>
      </>
    )
  },
  {
    icon: getIcon('Crisis'),
    iconGlow: categoryColors['Crisis'],
    date: '1992',
    title: 'Russia and Angola Defect',
    description: 'Both Russia and Angola exit De Beers\'s supply system, opening uncontrolled channels for diamonds to flood the market.',
    tags: ['Crisis'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1992, both Russia and Angola formally exited De Beers's supply system. These were two of the world's largest diamond producers. Their exit meant significant diamond volumes could now be sold outside the CSO at whatever price they could obtain — undermining De Beers's price management system.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Russian Problem</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Despite the 1990 loan deal, Russia's economic crisis deepened. The new Russian government needed hard currency urgently. Selling diamonds at whatever price the market offered — even below De Beers's "official" prices — was more attractive than honoring supply agreements. Russia began selling through its own channels, creating a parallel market in rough diamonds outside CSO control.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Angolan Problem</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Angola's situation was even more complex. A brutal civil war was being partially financed by diamond revenues from mines controlled by rebel factions. These "conflict diamonds" or "blood diamonds" were sold outside any official channel, at whatever price rebels could get.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Consequence for De Beers:</strong> The defections reduced De Beers's market share from ~80% to somewhere around 60-65% by the late 1990s. When market share falls below roughly 70-75%, a dominant firm begins losing the ability to unilaterally maintain prices.
        </div>
      </>
    )
  },
  {
    icon: getIcon('U.S. Law'),
    iconGlow: categoryColors['U.S. Law'],
    date: '1993',
    title: 'Hartford Fire Insurance — Effects Doctrine Crystallized',
    description: 'The U.S. Supreme Court rules that U.S. antitrust law applies to foreign conduct affecting the U.S. De Beers\'s shield begins to crack.',
    tags: ['U.S. Law'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The U.S. Supreme Court decided <strong><em>Hartford Fire Insurance Co. v. California</em></strong>, 509 U.S. 764 (1993). In this case, the Court held that the Sherman Act applies to <em>"foreign conduct that was meant to produce and did in fact produce some substantial effect in the United States."</em> This was the definitive statement of the <strong>Effects Doctrine</strong> — and it eliminated De Beers's geographic legal shield.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">What the Effects Doctrine Means</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Before <em>Hartford Fire</em>, courts debated whether the Sherman Act could reach foreign conduct by foreign entities. The traditional view was territorial: U.S. law applies in the U.S., foreign law applies abroad. <em>Hartford Fire</em> rejected this:</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>U.S. antitrust law applies to any conduct, wherever it occurs, if that conduct <em>substantially affects</em> U.S. commerce</li>
          <li>The defendant's nationality is irrelevant</li>
          <li>Where the conduct occurs is irrelevant</li>
          <li>What matters is the <em>effect</em> on U.S. markets</li>
        </ul>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Application to De Beers:</strong> By 1999, De Beers's CSO controlled ~65% of global rough diamond supply. The U.S. absorbed 46% of global retail diamond sales. Any manipulation of global diamond supply and prices by De Beers would "substantially affect" U.S. commerce. Under <em>Hartford Fire</em>, U.S. courts clearly had jurisdiction. De Beers could no longer claim it was beyond reach.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Legal Battle'),
    iconGlow: categoryColors['Legal Battle'],
    date: '1994',
    title: 'GE-De Beers Price Fixing Case — GE Acquitted',
    description: 'DOJ sues De Beers and GE for coordinating industrial diamond prices. GE is acquitted. De Beers never appears in court.',
    tags: ['Legal Battle'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The DOJ brought a civil suit alleging that De Beers and <strong>General Electric</strong> had colluded to fix prices in the market for <em>industrial diamonds</em> — using Belgian businessman Phillippe Loitier as an intermediary. The theory: De Beers would signal intended price increases to Loitier, who would pass this to GE, and GE would respond with matching increases.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The case went to trial. GE was <strong>acquitted in six weeks</strong>. De Beers never appeared in court.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why GE Was Acquitted — The Evidentiary Problem</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The DOJ could not prove that Loitier was De Beers's agent rather than an independent businessman acting on his own market knowledge. Contact between two companies through a common customer, without direct evidence of agreement, is not sufficient for conspiracy.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Conscious Parallelism:</strong> When competitors raise prices simultaneously without direct communication, this is called "conscious parallelism." Courts generally hold that parallel behavior alone, without "plus factors" indicating agreement, is not an antitrust violation. The DOJ needed direct evidence of agreement — and didn't have it.
        </div>
      </>
    )
  },
  {
    icon: getIcon('U.S. Law'),
    iconGlow: categoryColors['U.S. Law'],
    date: '1995',
    title: 'DOJ Codifies Effects Doctrine in Guidelines',
    description: 'DOJ formally extends U.S. jurisdiction to foreign conduct affecting U.S. commerce. De Beers\'s geographic shield is now legally obsolete.',
    tags: ['U.S. Law'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Building on the 1993 <em>Hartford Fire</em> decision, the DOJ published its <strong>Antitrust Enforcement Guidelines for International Operations</strong> in 1995. These guidelines formally stated that U.S. antitrust laws reach "anti-competitive conduct affecting United States import commerce or import commerce involving imports from other countries, even if the conduct is arranged or organized abroad or involves only foreign nationals."</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>The Three-Part Test for Jurisdiction:</strong> Under the 1995 guidelines, U.S. antitrust jurisdiction applies when: (1) the conduct has a direct, substantial, and foreseeable effect on U.S. commerce; (2) the effect gives rise to the claim under the Sherman Act; and (3) it is reasonable to expect that the defendant's conduct would lead to the asserted injury in the U.S. De Beers clearly met all three prongs.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why This Mattered for De Beers's Strategy</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">By 1995, De Beers knew with certainty that U.S. courts had jurisdiction over its conduct under the effects doctrine. Any attempt to enter the U.S. market directly would expose it to prosecution. The branding strategy its consultants would recommend in 1998 would require a U.S. presence, making these two facts fundamentally incompatible.</p>
      </>
    )
  }
]

export const era5: TimelineItemData[] = [
  {
    icon: getIcon('Crisis'),
    iconGlow: categoryColors['Crisis'],
    date: '1997',
    title: 'Asian Financial Crisis — Japan Collapses',
    description: 'Japan\'s diamond market crashes. The U.S. becomes even more essential — and legally treacherous — for De Beers.',
    tags: ['Crisis'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The 1997 Asian financial crisis devastated luxury goods markets across East Asia. Japan, which had been one of the world's largest diamond markets, saw diamond sales collapse from <strong>33% to 18% of global retail sales</strong> in less than a year — a 45% reduction in Japan's share of global diamond demand.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Structural Consequence for De Beers</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Japan's collapse meant the U.S. market became even more dominant. By 1998, the U.S. accounted for approximately <strong>46% of all global retail diamond jewelry sales</strong>. This created an acute strategic problem:</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>De Beers needed the U.S. market to succeed — it was now irreplaceable</li>
          <li>The U.S. market was precisely where De Beers was most legally vulnerable</li>
          <li>Without a U.S. presence, De Beers couldn't execute a branding strategy</li>
          <li>With a U.S. presence, De Beers would face antitrust prosecution</li>
        </ul>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Geographic Concentration Risk:</strong> When a company's entire market becomes concentrated in one country, its dependence on that country's legal and regulatory environment increases dramatically. De Beers, which had carefully managed its exposure to U.S. law, now found itself with no choice but to engage deeply with the U.S. market — and its laws.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: 'March 1998',
    title: 'De Beers & Anglo-American Separate',
    description: 'A historic structural change: De Beers and Anglo-American formally split into two independent entities.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In March 1998, De Beers and <strong>Anglo-American Corporation</strong> formally separated into two distinct, independent firms. The holding structure that had linked De Beers to Anglo-American's diversified mining empire for decades was dissolved. De Beers now stood alone — without the financial cushion of Anglo-American's portfolio.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">Why This Mattered</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The Anglo-American link had provided De Beers with access to capital from a diversified parent, diversification of risk, political and regulatory cover, and a buffer against short-term shareholder pressure.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Without Anglo-American, De Beers was exposed directly to its own shareholders' demands — including the growing cohort of American value investors who wanted short-term returns.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          The separation was a turning point. De Beers had to confront its own strategic weaknesses without the shelter of a parent company. This organizational independence accelerated the urgency of the strategic review that would follow.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: '1998',
    title: 'Nicky Oppenheimer + Bain & Co. — The Strategic Review',
    description: 'Nicky Oppenheimer becomes chairman. Bain & Company is hired — the first time De Beers has ever used external consultants.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 1998, a confluence of historic changes shook De Beers's management to its core. Nicky Oppenheimer became chairman. Gary Ralfe was brought in as MD from outside the family for the first time. For the first time ever, De Beers hired external management consultants: <strong>Bain & Company</strong>. Share price had fallen from ~$35 to ~$15. The diamond stockpile reached $4.8 billion.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">What Bain Found: The Two-Sided Problem</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3"><strong>The Bad News:</strong> The $4.8B stockpile was destroying value. Returns on capital were below the weighted average cost of capital. The cartel model of buying up supply to support prices was financially unsustainable.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3"><strong>The Good News:</strong> De Beers possessed one of the world's most valuable brand names. "A Diamond is Forever" was universally recognized, yet had been used only to promote diamonds generically. De Beers had enormous brand equity that it had never monetized for its own products.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Brand Value as an Asset:</strong> Bain valued the De Beers brand at potentially $175M in rough diamond terms or up to $1.25B at retail — representing the premium consumers would pay for branded De Beers diamonds vs. identical unbranded stones. This was an enormous unrealized asset.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Crisis'),
    iconGlow: categoryColors['Crisis'],
    date: '1998',
    title: 'American Value Investors Circle De Beers',
    description: 'U.S. value investors accumulate De Beers stock, reaching 21% ownership. They want short-term returns, not long-term cartel stability.',
    tags: ['Crisis'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">American value investors — institutional funds and managers who specialize in identifying undervalued companies — recognized De Beers's depressed share price and began accumulating shares. By 1999, U.S. value investors controlled approximately <strong>21% of De Beers stock</strong>.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Conflict of Perspectives</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Traditional De Beers shareholders had always accepted the cartel's logic: maintain prices through stockpiling, accept short-term losses for long-term industry health. American value investors saw the same stockpile as a <strong>value-destroying drag on returns</strong>.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Principal-Agent Problem:</strong> Shareholders are the principals; management (representing the Oppenheimer family's vision) are the agents. When external shareholders' interests diverge from management's strategy, corporate governance pressure builds. American investors' 21% stake was large enough to put pressure on management without being large enough to force a takeover — creating destabilizing board-level tension.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: '1999',
    title: 'UK Branding Pilot: 15% Premium Confirmed',
    description: 'De Beers tests branded diamonds in England. Consumers pay 15% more for "De Beers" diamonds vs. identical unbranded stones.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">De Beers tested its branding hypothesis in England, where antitrust risk was lower than in the U.S. The company promoted "De Beers diamonds" specifically, etching a microscopic De Beers logo directly onto stones. The results were striking: <strong>consumers paid approximately 15% more</strong> for De Beers branded diamonds compared to unbranded diamonds of identical quality and carat weight.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          "De Beers had been leaving money on the table by not monetizing its brand. It had achieved brand recognition by promoting diamonds generically — now it could capture that value for itself."
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">How Branding Changes Competition</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In a competitive market, diamonds are commodities — a Russian diamond and a De Beers diamond of identical quality are perfect substitutes. Branding creates product differentiation: consumers come to believe that De Beers diamonds are superior. This shifts competition from price competition to brand competition.</p>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Monopolistic Competition:</strong> Branded markets are analyzed as "monopolistic competition" — many sellers, differentiated products, some price-setting power for each seller based on brand loyalty. Unlike pure monopoly (one seller) or perfect competition (many sellers, identical products), monopolistic competition allows premium pricing based on perceived differentiation. De Beers's branding strategy was moving it from commodity supplier to monopolistically competitive branded firm.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: 'March 1999',
    title: 'Oppenheimer\'s HBS Speech — "I Am the Devil Incarnate"',
    description: 'Nicky Oppenheimer openly admits De Beers violated antitrust commandments "as a matter of policy" — an implicit plea for exemption.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In March 1999, Nicky Oppenheimer addressed Harvard Business School alumni. It was a remarkable speech — part business strategy, part philosophical brief, part implicit plea for legal exemption. Before an audience of the world's most sophisticated business minds, Oppenheimer did something extraordinary: he admitted everything.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Oppenheimer compared U.S. antitrust law to religious commandments: <em>"Thou shalt not monopolize. Thou shalt not fix prices. Thou shalt not allocate markets. Thou shalt not restrict output."</em> Then he called himself: <em>"the devil incarnate, the anti-Christ"</em> from the perspective of antitrust law believers. And he confirmed: De Beers had violated virtually every commandment — <strong>"as a matter of policy."</strong></p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Defense: "Thou Shalt Honor the Consumer"</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">Oppenheimer argued one commandment De Beers did follow: honoring the consumer. His data:</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>Diamond prices rose only 5.4% per annum (1985-1996) vs. 3.5% CPI — only modestly above inflation</li>
          <li>Diamond prices were far more stable than gold, oil, or aluminum</li>
          <li>The cartel prevented boom-bust cycles that plague commodity markets</li>
          <li>De Beers's system had created stable markets for African diamond producers, supporting development</li>
        </ul>
      </>
    )
  },
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: '1999',
    title: 'The Millennium Campaign — 68/72 Diamonds Sold Before Lunch',
    description: 'De Beers launches its millennium campaign. In Japan, one dealer sells 68 of his 72 millennium diamonds on the first morning.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">De Beers launched an ambitious millennium branding campaign. The centerpiece: the <strong>"De Beers Millennium Star"</strong>. Surrounding it were 11 blue diamonds of extraordinary rarity. The collection was branded, insured for £350 million, and targeted at ultra-high-net-worth consumers.</p>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The results were extraordinary. In Japan — which had been a troubled market since the 1997 crisis — <strong>one dealer sold 68 out of his 72 millennium diamonds on the first day of the campaign</strong>. Essentially his entire allocation was sold before lunch.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          "The stones were selling because they had the De Beers brand attached to them. Brand value was translating into pricing power and sales volume." — De Beers Case Notes
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Stockpile Opportunity</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">If De Beers could sell branded diamonds at 15%+ premiums, it could reduce its $4.8B stockpile without collapsing prices. Instead of flooding the market with cheap inventory, it could sell smaller quantities at higher prices, gradually reducing inventory while maintaining (or even improving) margins. The branding strategy was the financial solution to the stockpile crisis.</p>
      </>
    )
  },
  {
    icon: getIcon('Legal Risk'),
    iconGlow: categoryColors['Legal Risk'],
    date: '1999',
    title: 'Deutsche Bank: Antitrust Is a "Poison Pill"',
    description: 'Deutsche Bank Securities warns that De Beers\'s antitrust exposure is "indeed a poison pill" for the branding strategy.',
    tags: ['Legal Risk'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In November 1999, Deutsche Bank Securities published a financial analysis of De Beers that captured the central strategic dilemma in stark terms: <em>"the Antitrust ruling is indeed a poison pill... The impact of a resolution of the Anti-Trust issue should not be underestimated."</em></p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">What "Poison Pill" Means Here</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In corporate finance, a "poison pill" is a defense mechanism that makes a company very costly to acquire. Deutsche Bank was using the term metaphorically: De Beers's antitrust exposure was a poison pill for its branding strategy — it made the strategy simultaneously necessary and potentially fatal.</p>
        <div className="bg-[#dc2626]/5 border-l-[3px] border-[#dc2626] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>The Dilemma Formalized:</strong> De Beers faced a choice between two fatal options: (A) Stay out of the U.S. → branding strategy fails, stockpile crisis continues, shareholders revolt, value destruction; or (B) Enter the U.S. → DOJ prosecutes, CSO system faces injunction, cartel potentially dismantled, but at least the brand strategy might work. Option B was ultimately chosen — leading to the 2004 settlement.
        </div>
      </>
    )
  }
]

export const era6: TimelineItemData[] = [
  {
    icon: getIcon('Strategy'),
    iconGlow: categoryColors['Strategy'],
    date: '2000',
    title: 'Ad Age: "A Diamond is Forever" — Slogan of the Century',
    description: 'Advertising Age magazine names "A Diamond is Forever" the most recognized advertising slogan of the 20th century.',
    tags: ['Strategy'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">At the turn of the millennium, <strong>Advertising Age</strong> magazine named <em>"A Diamond is Forever"</em> the most recognized advertising slogan of the 20th century — Slogan of the Century. Created in 1947 by Frances Gerety at N.W. Ayer, this four-word phrase had reshaped global cultural norms around marriage, commitment, and luxury goods.</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Astonishing Economics of the Campaign</h3>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>Less than 1% of revenues spent on advertising (vs. ~10% for luxury spirits)</li>
          <li>Created the norm that engagement rings should be diamonds</li>
          <li>Established the "two months' salary" pricing norm — engineering consumer price expectations</li>
          <li>Discouraged resale by associating diamonds with permanent commitment ("forever")</li>
          <li>Made diamonds emotionally inelastic</li>
        </ul>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          Advertising Age's recognition is extraordinary: the slogan that defined a century of marketing was created not to sell a specific brand, but to sell a commodity category — on behalf of a cartel that could then charge monopoly prices for that commodity.
        </div>
      </>
    )
  },
  {
    icon: getIcon('Legal Battle'),
    iconGlow: categoryColors['Legal Battle'],
    date: '2004',
    title: 'De Beers Settles with the DOJ — Cartel Era Ends',
    description: 'Facing the effects doctrine and the need to enter the U.S. market, De Beers settles. Over 100 years of evasion ends.',
    tags: ['Legal Battle'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In 2004, De Beers reached a settlement with the U.S. Department of Justice. The company:</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li>Paid a fine (reported at approximately $10 million — modest relative to De Beers's size)</li>
          <li>Agreed to certain constraints on its conduct</li>
          <li>Was permitted to enter the U.S. market directly for the first time</li>
          <li>Could now market "De Beers" branded diamonds to American consumers</li>
        </ul>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">For the first time in the company's history, De Beers had legal standing in the United States. Over 100 years of deliberate evasion ended with a settlement — and the company emerged free to pursue the branding strategy it desperately needed.</p>
        <div className="bg-accent-color/5 border-l-[3px] border-accent-color rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          The settlement was, in effect, De Beers buying its way into the U.S. market. The fine was the price of legal legitimacy — and given the brand opportunity worth potentially $1.25B at retail, it was a bargain.
        </div>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">What the Settlement Didn't Resolve</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">The settlement addressed De Beers's legal exposure for past conduct. It did not necessarily dismantle the CSO system or restore competitive markets in rough diamonds. De Beers remained a dominant force in the industry. The structural features that enabled the cartel — control of distribution, exclusive supply contracts, the sightholder system — were not eliminated overnight.</p>
      </>
    )
  },
  {
    icon: getIcon('Modern Era'),
    iconGlow: categoryColors['Modern Era'],
    date: '2018+',
    title: 'Lightbox: De Beers Launches Synthetic Diamonds',
    description: 'De Beers launches "Lightbox," its own line of lab-grown synthetic diamonds — at prices far below natural diamonds.',
    tags: ['Modern Era'],
    details: (
      <>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-0 mb-2 border-b border-card-border pb-1">What Happened</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">In one of the most stunning strategic pivots in business history, De Beers launched <strong>Lightbox</strong> — its own line of <em>lab-grown synthetic diamonds</em> — priced at a fraction of natural diamond prices ($800/carat for synthetics vs. thousands for comparable naturals).</p>
        <h3 className="text-[0.75rem] font-semibold tracking-widest uppercase font-roboto-mono text-accent-color mt-5 mb-2 border-b border-card-border pb-1">The Strategic Logic</h3>
        <p className="text-[0.91rem] leading-relaxed text-text-secondary mb-3">This appears paradoxical: the company that built its entire empire on the premise that diamonds are rare and precious is now selling abundant, factory-made alternatives. But the logic is sophisticated:</p>
        <ul className="list-disc pl-5 mb-3 text-[0.88rem] text-text-secondary leading-relaxed marker:text-text-secondary/50">
          <li><strong>Market segmentation:</strong> Position lab-grown diamonds as fashion jewelry separate from natural diamonds</li>
          <li><strong>Preemption:</strong> By entering the synthetic market itself, De Beers prevents competitors from using synthetics to undermine natural diamond prices</li>
          <li><strong>Price discipline:</strong> By pricing synthetics deliberately low, De Beers establishes that they are "not natural diamonds"</li>
          <li><strong>Brand protection:</strong> Controlling the synthetic narrative allows De Beers to define the categories</li>
        </ul>
        <div className="bg-[#2563eb]/5 border-l-[3px] border-[#2563eb] rounded-r-md px-4 py-3 my-3 text-[0.88rem] leading-relaxed text-text-secondary">
          <strong>Market Definition Revisited:</strong> The synthetic diamond threat raises a fundamental antitrust question: are synthetic and natural diamonds in the same market? If consumers treat them as substitutes, synthetic entry expands the relevant market, reducing De Beers's market share and power. If consumers treat them as distinct products (fashion vs. investment), the markets remain separate. Lightbox's pricing strategy is designed to maintain the distinction.
        </div>
      </>
    )
  }
]
