/**
 * Guides for Singapore and foreign buyers looking at new launches in Johor Bahru.
 *
 * Rules these texts follow (rewritten 2026-09-25):
 * - Every number comes from the developer records on the project sheet (prices, sizes, units,
 *   completion years), from OpenStreetMap measurements (straight-line distances) or from the
 *   published statements of the RTS Link operator and the Malaysian and Singapore governments.
 *   No yields, no price forecasts, no invented percentages.
 * - Developer claims ("400 m covered walkway") are attributed to the developer.
 * - Project facts, floor plans and photos live on jbproperties.my; articles link there and do not
 *   repeat the listing.
 * - Chinese copies are in blog-data.zh.ts.
 */
import { BlogPost, AreaGuide, DeveloperProfile } from "../types";
import { greenHero } from "./green-index";

const UPDATED = "September 25, 2026";

export const blogPosts: BlogPost[] = [
  {
    title: "Why Singaporeans Buy Property in Johor Bahru: The Practical Reasons",
    slug: "why-singaporeans-buying-property-johor-bahru",
    date: "July 11, 2026",
    updated: UPDATED,
    category: "Buying from Singapore",
    readTime: "3 min read",
    summary: "Space for the money, the RTS Link, freehold titles held in your own name, and a second base across the strait. The reasons Singapore buyers give, with the facts behind each one.",
    image: greenHero("aethera-residences"),
    imageAlt: "Aethera Residences, Ibrahim International Business District, Johor Bahru",
    seoTitle: "Why Singaporeans Buy Property in Johor Bahru | jbpropertyportal.my",
    metaDescription: "The practical reasons Singapore buyers give for buying new-launch homes in Johor Bahru: prices and sizes on the current listings, the RTS Link to Woodlands North, freehold titles, and what to check before you commit.",
    relatedProjects: ["aethera-residences", "coronade-twins", "brixton-tower"],
    content: `Johor Bahru sits directly across the Strait of Johor from Woodlands. For a Singapore household it is the closest foreign property market there is, in a country with familiar food, familiar languages and a currency that stretches further than the Singapore dollar. The reasons buyers give us fall into four groups.

## 1. Space for the money

The nine new launches on our listing site start from RM300,000 for a small unit at M Grand Minori in Taman Pelangi and go up to RM5,000,000 for the largest unit at Aethera Residences (developer's indicative prices, September 2026). Built-up sizes run from 280 sq ft studios to 2,594 sq ft duplexes. Buyers compare that with what the same budget buys in Singapore. We do not publish yield or appreciation forecasts.

## 2. The RTS Link

The Johor Bahru–Singapore Rapid Transit System Link will run between Bukit Chagar in Johor Bahru and Woodlands North. The operator describes a ride of about five minutes, with immigration for both countries cleared at the departure station, and passenger service is officially targeted for around the end of 2026. Several listed projects are a short walk away: measured in a straight line from the project coordinates, [Coronade Twins](https://www.jbproperties.my/project/coronade-twins) is about 350 m and [Aethera Residences](https://www.jbproperties.my/project/aethera-residences) about 400 m from the station (OpenStreetMap).

## 3. Freehold titles in your own name

All nine projects we list are freehold. Foreigners, including Singaporeans, can hold Johor strata property in their own name once the state's foreign-purchase conditions are met. Our foreign buyer guide covers the current price threshold and the consent process.

## 4. A second base, not only an investment

Many buyers want a weekend home, a place for parents, or a base for work in Johor, and the Johor–Singapore Special Economic Zone agreement signed by both governments in 2025 adds to that.

## Check these before you commit

- HDB owners: Singapore's rules on owning private property overseas while holding an HDB flat, including the Minimum Occupation Period, apply to you. Confirm your position with HDB.
- Financing: Malaysian banks lend to Singapore buyers, on their own terms. See the home loan guide.
- Land title: most of these projects are serviced apartments on commercial title under the Housing Development Act. Ask your lawyer what that means for utility tariffs and assessment.

## FAQ

#### Can a Singaporean own a freehold condominium in Johor?

Yes, once the Johor state foreign-purchase conditions are met and state consent is obtained. Your lawyer files the application after the sale and purchase agreement is signed.

#### Do I need to be in Malaysia to buy?

Not for most steps. Booking, the SPA and loan papers can be arranged through a Malaysian lawyer from Singapore, though some banks ask to meet you once.`
  },
  {
    title: "How Foreigners Buy Property in Johor Bahru: Steps, Approvals and Costs",
    slug: "guide-foreigners-buying-property-malaysia",
    date: "July 8, 2026",
    updated: UPDATED,
    category: "Buying Guides",
    readTime: "3 min read",
    summary: "The six steps from booking to keys for a non-Malaysian buyer: the state price threshold, the sale and purchase agreement, state consent, financing, stamp duty and delivery under the Housing Development Act.",
    image: greenHero("coronade-twins"),
    imageAlt: "Coronade Twins, Ibrahim International Business District, Johor Bahru",
    seoTitle: "How Foreigners Buy Property in Johor Bahru: Step-by-Step | jbpropertyportal.my",
    metaDescription: "Step-by-step guide for foreign buyers of new-launch property in Johor Bahru: the state minimum price, booking and SPA, Johor state consent, home loans, stamp duty on a sliding scale and delivery under the HDA.",
    relatedProjects: ["coronade-twins", "aethera-residences", "princess-cove-phase-3"],
    content: `Non-citizens buy Malaysian property under each state's foreign-purchase rules; permanent residents should check their position with a lawyer. Here is the path for a new-launch strata unit in Johor Bahru.

## Step 1: Check the minimum price

Each state sets a minimum price for foreign buyers. In Johor the floor commonly applied to strata homes is RM1,000,000, with exceptions in some designated zones. The figure is set by the state and can change, so confirm the current threshold for the specific project with your lawyer before you book. Several projects we list have units both below and above this line; the lower-priced units are for Malaysian buyers.

## Step 2: Book and sign

You pay a booking deposit set by the developer, then sign the sale and purchase agreement (SPA) within the period stated on the booking form, usually a few weeks. New launches follow the payment schedule fixed by the Housing Development Act, the same for every buyer of that project.

## Step 3: Johor state consent

A foreign buyer needs the state authority's consent before the title can be transferred. Your lawyer applies after the SPA is signed; a consent fee is payable to the state and the process runs into months. Developer panel lawyers handle this routinely.

## Step 4: Financing

Malaysian banks lend to foreign buyers. The margin, tenure and documents differ from a local's loan. See our home loan guide.

## Step 5: Stamp duty and legal fees

Stamp duty on the transfer is charged on a sliding scale by price, and legal fees follow the Solicitors' Remuneration Order scale. Ask for a written estimate before signing. The figures depend on price and can change with the annual budget.

## Step 6: Completion and keys

For high-rise projects sold under the standard HDA contract, the developer must deliver vacant possession within the period stated in the SPA, commonly 36 months from signing. Late delivery attracts compensation under the same contract.

## Selling later

Real Property Gains Tax applies to the profit on a sale; the rate depends on how long you held the property and your citizenship, and is higher in the early years. Confirm the current schedule when you sell.

## FAQ

#### Can foreigners buy any property in Johor?

No. Malay reserve land, low-cost housing and several other categories are closed to foreign buyers. All nine projects we list are strata high-rise, the category normally open to foreigners, subject to the price threshold.

#### Who applies for state consent?

Your lawyer, after the SPA is signed. You do not deal with the state office yourself.`
  },
  {
    title: "The RTS Link and Johor Bahru Property: What Is Known and What Is Not",
    slug: "rts-link-impact-johor-bahru-prices",
    date: "July 5, 2026",
    updated: UPDATED,
    category: "RTS Link",
    readTime: "3 min read",
    summary: "The facts about the Bukit Chagar to Woodlands North line, the measured distances from each listed project, and why this site does not forecast prices.",
    image: greenHero("coronade-twins"),
    imageAlt: "Coronade Twins, about 350 m from Bukit Chagar RTS station in a straight line",
    seoTitle: "RTS Link and Johor Bahru Property: Facts and Distances | jbpropertyportal.my",
    metaDescription: "What the Johor Bahru–Singapore RTS Link is, when it is targeted to open, and how far each listed new launch is from Bukit Chagar station, measured in a straight line. No price forecasts.",
    relatedProjects: ["coronade-twins", "aethera-residences", "dover-tower", "princess-cove-phase-3"],
    content: `## The line itself

The Johor Bahru–Singapore Rapid Transit System Link connects Bukit Chagar station, next to the Sultan Iskandar customs complex in Johor Bahru city centre, with Woodlands North station in Singapore. The operator describes a ride of about five minutes and a capacity of up to 10,000 passengers per hour in each direction. Immigration for both countries is cleared at the station you depart from. Passenger service is officially targeted for around the end of 2026; check the operator's announcements for the current date.

## Which listed projects are near it

Distances below are straight lines from the project coordinates to Bukit Chagar station, measured on OpenStreetMap. A walk is always longer.

| Project | Straight line to Bukit Chagar |
|---|---|
| [Coronade Twins](https://www.jbproperties.my/project/coronade-twins) | about 350 m |
| [Aethera Residences](https://www.jbproperties.my/project/aethera-residences) | about 400 m |
| [Causewayz Square – Dover Tower](https://www.jbproperties.my/project/dover-tower) | about 760 m |
| [Causewayz Square – Brixton Tower](https://www.jbproperties.my/project/brixton-tower) | about 840 m |
| [Causewayz Square – Axis Tower](https://www.jbproperties.my/project/axis-tower) | about 870 m |
| [Princess Cove Phase 3](https://www.jbproperties.my/project/princess-cove-phase-3) | about 1.1 km |
| [Princess Cove Phase 2](https://www.jbproperties.my/project/princess-cove-phase-2) | about 1.4 km |
| [M Grand Minori](https://www.jbproperties.my/project/m-grand-minori) | about 1.9 km |

Gen Sphere is left out until its coordinates on the project sheet are confirmed.

## What the developers say about links

Some developers state a covered connection: UOA describes a 400 m covered walkway from Aethera Residences to the station, EXSIM a 600 m covered link bridge from Causewayz Square to the customs complex and the station, and R&F a 650 m link bridge from Princess Cove Phase 2. These are the developers' statements about works that are not yet open; ask for the current status when you view.

## What this site does not do

We do not publish price or rental forecasts tied to the RTS Link. The prices on the listing pages are the developers' indicative prices at the time of update, and anything beyond that would be a guess. What you can check yourself is the distance, the developer's stated link, the completion year and the price list.

## FAQ

#### How long is the RTS ride?

About five minutes between Bukit Chagar and Woodlands North, according to the operator.

#### When does the RTS Link open?

Passenger service is officially targeted for around the end of 2026. The operator publishes updates.

#### Where exactly is Bukit Chagar station?

Beside the Sultan Iskandar Building, the Johor Bahru customs, immigration and quarantine complex at the Causeway, in the city centre.`
  },
  {
    title: "Johor Bahru New Launches in 2026: What Is Actually on the Market",
    slug: "johor-bahru-property-market-outlook",
    date: "July 2, 2026",
    updated: UPDATED,
    category: "Market",
    readTime: "3 min read",
    summary: "A plain inventory of the nine new-launch projects on our listing site: prices, sizes, unit counts, completion years and tenure, straight from the developer records.",
    image: greenHero("princess-cove-phase-3"),
    imageAlt: "Princess Cove Phase 3, Tanjung Puteri waterfront, Johor Bahru",
    seoTitle: "Johor Bahru New Launches 2026: Prices, Sizes, Completion | jbpropertyportal.my",
    metaDescription: "What is on the Johor Bahru new-launch market in 2026: nine projects near the RTS Link and CIQ compared by developer price range, unit size, number of units, completion year and tenure.",
    relatedProjects: ["princess-cove-phase-3", "m-grand-minori", "gen-sphere", "axis-tower"],
    content: `Instead of an outlook, here is what is actually for sale. The table covers the nine projects on our listing site, using the developers' records as updated in September 2026.

| Project | Area | From (RM) | Built-up (sq ft) | Units | Completion |
|---|---|---|---|---|---|
| [M Grand Minori](https://www.jbproperties.my/project/m-grand-minori) | Taman Pelangi | 300,000 | 403–835 | 1,733 | 2030 |
| [Coronade Twins](https://www.jbproperties.my/project/coronade-twins) | IIBD | 476,000 | 280–1,230 | 539 | 2030 |
| [Gen Sphere](https://www.jbproperties.my/project/gen-sphere) | Taman Sri Tebrau | 550,000 | 459–755 | 996 | 2029 |
| [Causewayz Square – Axis Tower](https://www.jbproperties.my/project/axis-tower) | JBCC / Lumba Kuda | 580,300 | 366–592 | 1,100 | 2029 |
| [Causewayz Square – Brixton Tower](https://www.jbproperties.my/project/brixton-tower) | JBCC / Lumba Kuda | 691,000 | 474–850 | 1,200 | 2029 |
| [Princess Cove Phase 2](https://www.jbproperties.my/project/princess-cove-phase-2) | Tanjung Puteri | 690,000 | 471–1,471 | 3,724 | Completed 2023 |
| [Princess Cove Phase 3](https://www.jbproperties.my/project/princess-cove-phase-3) | Tanjung Puteri | 720,000 | 314–1,556 | 4,385 | 2027 |
| [Causewayz Square – Dover Tower](https://www.jbproperties.my/project/dover-tower) | JBCC / Lumba Kuda | 727,500 | 474–850 | 1,200 | 2029 |
| [Aethera Residences](https://www.jbproperties.my/project/aethera-residences) | IIBD | 1,200,000 | 650–2,594 | 786 | 2029 |

## What the table tells you

- Every project is freehold and sold as serviced apartments on commercial title under the Housing Development Act.
- Only one project, Princess Cove Phase 2, is completed. The rest are under construction with delivery between 2027 and 2030 according to the developers.
- Scale varies a great deal. Coronade Twins has 539 units; the two Princess Cove phases have more than 8,000 between them.
- Entry prices range from RM300,000 to RM1,200,000. Foreign buyers should read these against the Johor minimum purchase price for foreigners, covered in our foreign buyer guide.

## Things worth weighing

Positioning differs even within one development. EXSIM markets Axis Tower for short-term rental with an operator, and Brixton and Dover Towers for owner-occupiers, with the developer stating separate zoning. Gen Sphere and M Grand Minori offer dual-key layouts according to their records. Completion timing matters for anyone planning to move in when the RTS Link opens.

## FAQ

#### Are any of these projects completed?

Princess Cove Phase 2 is recorded as completed in 2023. The other eight are under construction.

#### Are the prices final?

No. They are the developers' indicative prices at the time the listing was updated. Ask for the current price list before booking.`
  },
  {
    title: "Where to Buy Near the Johor Bahru CIQ: Five Pockets, Measured",
    slug: "best-areas-buy-property-near-ciq",
    date: "June 25, 2026",
    updated: UPDATED,
    category: "Areas",
    readTime: "3 min read",
    summary: "The five neighbourhoods where the listed new launches sit, with the straight-line distance from each project to the customs complex and to Bukit Chagar station.",
    image: greenHero("dover-tower"),
    imageAlt: "Causewayz Square Dover Tower, Lumba Kuda, beside the Johor Bahru CIQ",
    seoTitle: "Where to Buy Near the JB CIQ: Five Areas Compared | jbpropertyportal.my",
    metaDescription: "Compare the five Johor Bahru neighbourhoods with new launches near the CIQ: Lumba Kuda, IIBD, Tanjung Puteri, Taman Pelangi and Taman Sri Tebrau, with measured distances to the checkpoint and the RTS station.",
    relatedProjects: ["dover-tower", "aethera-residences", "princess-cove-phase-3", "m-grand-minori"],
    content: `The Sultan Iskandar Building is the customs, immigration and quarantine complex at the Johor Bahru end of the Causeway, with Bukit Chagar RTS station being built beside it. The listed new launches sit in five pockets around it. Distances are straight lines from the project coordinates, measured on OpenStreetMap; the walk is longer, and any covered link is the developer's statement.

## 1. Lumba Kuda and Johor Bahru City Centre

The blocks immediately west of the customs complex. EXSIM's Causewayz Square has three towers here: [Dover Tower](https://www.jbproperties.my/project/dover-tower) about 130 m from the checkpoint, [Brixton Tower](https://www.jbproperties.my/project/brixton-tower) about 220 m and [Axis Tower](https://www.jbproperties.my/project/axis-tower) about 250 m. Johor Bahru City Square mall is within about 650 m of all three.

## 2. Ibrahim International Business District

The financial district planned around Coronation Square, north-west of the complex. [Coronade Twins](https://www.jbproperties.my/project/coronade-twins) is about 350 m from Bukit Chagar station and 570 m from the checkpoint; [Aethera Residences](https://www.jbproperties.my/project/aethera-residences) about 400 m and 760 m. Komtar JBCC is the nearest mall to both.

## 3. Tanjung Puteri waterfront

R&F's Princess Cove development on reclaimed land south-east of the complex. [Phase 3](https://www.jbproperties.my/project/princess-cove-phase-3) is about 430 m from the checkpoint and [Phase 2](https://www.jbproperties.my/project/princess-cove-phase-2), which is completed, about 650 m. R&F Mall is part of the development.

## 4. Taman Pelangi

An established neighbourhood north of the city centre. [M Grand Minori](https://www.jbproperties.my/project/m-grand-minori) is about 1.9 km from Bukit Chagar station, with Pelangi Leisure Mall about 560 m away. The developer lists a shuttle bus to the customs complex.

## 5. Taman Sri Tebrau

North-east of the centre, along the Tebrau corridor. [Gen Sphere](https://www.jbproperties.my/project/gen-sphere) sits here; its measured distances are withheld until the coordinates on the project sheet are confirmed.

## How to use this

Nearest is not automatically best. The three closest towers are also part of the largest schemes, and the Princess Cove phases add thousands of units to one address. Weigh distance against unit count, completion year and price, all on the listing pages.

## FAQ

#### Which listed project is closest to the customs complex?

Causewayz Square Dover Tower, about 130 m in a straight line.

#### Which is closest to Bukit Chagar RTS station?

Coronade Twins, about 350 m in a straight line, followed by Aethera Residences at about 400 m.`
  },
  {
    title: "Freehold vs Leasehold in Malaysia, and What 'Commercial Title' Means",
    slug: "freehold-vs-leasehold-property-malaysia",
    date: "June 18, 2026",
    updated: UPDATED,
    category: "Buying Guides",
    readTime: "3 min read",
    summary: "How the two tenures work, why all nine listed projects are freehold, and what to ask when a serviced apartment sits on commercial land under the Housing Development Act.",
    image: greenHero("brixton-tower"),
    imageAlt: "Causewayz Square Brixton Tower, Johor Bahru city centre",
    seoTitle: "Freehold vs Leasehold in Malaysia Explained | jbpropertyportal.my",
    metaDescription: "Freehold and leasehold tenure in Malaysia explained for foreign buyers, plus what 'commercial title under the HDA' means for a serviced apartment. All nine listed Johor Bahru projects are freehold.",
    relatedProjects: ["brixton-tower", "aethera-residences", "princess-cove-phase-2"],
    content: `## Freehold

The owner holds the land, or the strata share of it, without a time limit. Ownership passes to heirs and can be sold at any time. It remains subject to planning rules and to the state's power of compulsory acquisition, like land anywhere.

## Leasehold

The state grants the land for a fixed term, often 99 years, and the title shows the expiry date. The owner can apply to extend the lease before it runs out, for a premium set by the state. Banks look at the years remaining when they decide on a loan. Leasehold is common in Malaysia and many well-run developments are leasehold; it simply adds a date to check.

## Why it matters less here

All nine projects on our listing site are recorded as freehold by their developers, so tenure is not the deciding factor between them. It becomes relevant if you compare them with other Johor Bahru projects.

## Commercial title under the HDA

Most of these projects are serviced apartments built on land zoned commercial, and sold under the Housing Development Act like other homes. Three practical points follow:

- Utilities may be billed at commercial tariffs. Ask the developer which tariff applies.
- Local council assessment can differ from a residential title.
- Buyer protection under the HDA, including the standard contract and the compensation for late delivery, still applies because the units are sold as homes.

Your lawyer can confirm all three for the specific project before you sign.

## What foreigners should note

Foreign ownership rules are about the price threshold and state consent, not about tenure. A foreign buyer can hold freehold or leasehold strata property in Johor once consent is given.

## FAQ

#### Are any of the listed projects leasehold?

No. All nine are recorded as freehold on the developers' records.

#### Does 'commercial title' mean I cannot live there?

No. Serviced apartments on commercial title are sold and used as homes. The label affects tariffs and assessment, which you should confirm before buying.`
  },
  {
    title: "Buying in Johor Bahru from Singapore: A Checklist",
    slug: "johor-singapore-investment-guide",
    date: "June 14, 2026",
    updated: UPDATED,
    category: "Buying from Singapore",
    readTime: "3 min read",
    summary: "Twelve things to settle before you book a new launch in Johor Bahru from Singapore, in the order they come up.",
    image: greenHero("princess-cove-phase-2"),
    imageAlt: "Princess Cove Phase 2, completed waterfront development, Johor Bahru",
    seoTitle: "Buying Property in Johor Bahru from Singapore: Checklist | jbpropertyportal.my",
    metaDescription: "A twelve-point checklist for Singapore residents buying a new-launch home in Johor Bahru: HDB rules, the foreign price threshold, the SPA, state consent, loans, currency, and what to do at handover.",
    relatedProjects: ["princess-cove-phase-2", "coronade-twins", "axis-tower"],
    content: `This is the order in which questions come up when a Singapore resident buys a new launch in Johor Bahru. Each point links to the fuller guide where there is one.

## Before you view

1. **Your HDB position.** If you own an HDB flat, confirm with HDB whether you may own private property overseas and whether the Minimum Occupation Period has passed.
2. **The foreign price threshold.** Johor sets a minimum price for foreign buyers; confirm the current figure for the project you like. Units below it are for Malaysians.
3. **Budget in ringgit.** The purchase price, loan and fees are all in ringgit. Decide how you will fund the down payment and monthly instalments, and with which bank.

## At the sales gallery

4. **Ask for the current price list and the payment schedule.** Prices on any website are indicative until the developer confirms them.
5. **Ask about the land title and tariffs.** Most listed projects are serviced apartments on commercial title. Ask which utility tariff applies.
6. **Ask about zoning inside the development.** Some developments separate short-term rental towers from owner-occupier towers, as EXSIM states for Causewayz Square.
7. **Check the completion year.** Delivery dates on the listing pages are the developers' targets, from 2027 to 2030 for the projects under construction.

## Before you sign

8. **Appoint a lawyer.** Developer panel lawyers are usual for new launches; you may appoint your own.
9. **Get a written cost estimate** covering stamp duty, legal fees and the state consent fee.
10. **Secure a loan in principle** before the SPA if you need financing. See the home loan guide.

## After signing

11. **State consent.** Your lawyer applies. Expect the process to take months.
12. **Handover.** Under the standard HDA contract, delivery is due within the period stated in the SPA, commonly 36 months. Inspect the unit and report defects within the defect liability period stated in the contract.

## FAQ

#### Can I pay from a Singapore bank account?

Yes. Payments are made in ringgit to the developer's or lawyer's account; your bank converts the currency.

#### Do I need a Malaysian bank account?

Not to buy. It is convenient for loan instalments and maintenance fees later, and Malaysian banks open accounts for foreign property owners with the usual documents.`
  },
  {
    title: "Home Loans in Malaysia for Foreign and Singapore Buyers",
    slug: "how-foreigners-obtain-malaysian-home-loan",
    date: "June 10, 2026",
    updated: UPDATED,
    category: "Buying Guides",
    readTime: "3 min read",
    summary: "How a non-Malaysian gets a mortgage from a Malaysian bank: who lends, what the loan looks like, the documents you will be asked for, and the questions to ask before you sign the SPA.",
    image: greenHero("axis-tower"),
    imageAlt: "Causewayz Square Axis Tower, Johor Bahru city centre",
    seoTitle: "Malaysian Home Loans for Foreigners and Singaporeans | jbpropertyportal.my",
    metaDescription: "How foreign and Singapore buyers get a home loan from a Malaysian bank for a Johor Bahru new launch: loan margin and tenure, currency, the document list, and the order of steps around the SPA.",
    relatedProjects: ["axis-tower", "aethera-residences", "gen-sphere"],
    content: `Malaysian banks do lend to foreign buyers, including Singapore residents with no Malaysian income. Terms are set bank by bank, so this is the shape of the process, not a rate sheet.

## What the loan looks like

- **Currency.** The loan is in ringgit and repaid in ringgit, whatever currency you earn in.
- **Margin.** Banks generally lend a smaller share of the price to a foreign buyer than to a Malaysian, and the share varies with the bank, your income and the project.
- **Tenure.** The loan runs to a maximum age set by the bank, so the tenure depends on how old you are at approval.
- **Rate.** Loans are usually priced off the bank's base rate, which moves with Bank Negara Malaysia's policy rate; the bank quotes the current figure.

## Who lends

The large Malaysian banks and several Singapore banks with Malaysian operations. Developers usually have a panel of banks for each project; the panel is convenient but you may approach any bank.

## Documents you will be asked for

- Passport and, for Singapore residents, NRIC
- Recent payslips and your latest income tax notice of assessment
- Bank statements showing salary credits
- A credit report from your home country, such as the Credit Bureau Singapore report
- The booking form or SPA for the unit

Self-employed buyers are asked for business registration and accounts instead of payslips.

## The order of steps

1. Ask for an indication of the margin before you book.
2. Apply once you have the booking form, so the letter of offer is ready before the SPA deadline.
3. Sign the loan agreement with the bank's lawyer; the bank pays the developer according to the HDA progress schedule.
4. Instalments start as the bank disburses; ask how interest is charged during construction.

## Questions to ask the bank

- Is there a lock-in period and what does early settlement cost?
- Does the bank require fire and mortgage insurance, and can you choose the insurer?
- Are there fees for paying instalments from a foreign account?

## FAQ

#### Can I get a Malaysian loan with only Singapore income?

Yes. Banks assess foreign income with the documents above; the share of the price they lend may be lower than for a Malaysian borrower.

#### Should I sign the SPA before the loan is approved?

Get a letter of offer, or at least a clear indication from the bank, first. The SPA commits you to the purchase whether or not a loan follows.`
  },
  {
    title: "Living in Johor Bahru and Working in Singapore: How the Commute Works",
    slug: "living-johor-bahru-working-singapore",
    date: "June 3, 2026",
    updated: UPDATED,
    category: "Living in JB",
    readTime: "3 min read",
    summary: "The crossings available today, what the RTS Link changes, and what is around the listed projects in daily life: malls, schools and clinics from the developer records and OpenStreetMap.",
    image: greenHero("aethera-residences"),
    imageAlt: "Aethera Residences, Johor Bahru city centre",
    seoTitle: "Living in JB, Working in Singapore: The Commute Explained | jbpropertyportal.my",
    metaDescription: "How the daily Johor Bahru to Singapore commute works today by Causeway and Second Link, what the RTS Link changes from its targeted opening, and what is near the listed homes in daily life.",
    relatedProjects: ["aethera-residences", "coronade-twins", "dover-tower", "m-grand-minori"],
    content: `## The crossings today

Two road links connect Johor Bahru and Singapore: the Causeway from the city centre to Woodlands, and the Second Link from Iskandar Puteri to Tuas. Commuters cross by car, motorcycle or bus, and time at the checkpoints varies with the hour and the day. Anyone planning a daily commute should try it at their intended hour before buying.

## What the RTS Link changes

From its officially targeted opening around the end of 2026, the RTS Link will run between Bukit Chagar station beside the customs complex and Woodlands North, a ride the operator puts at about five minutes, with both countries' immigration cleared before boarding. That removes the road queue for anyone who lives within reach of Bukit Chagar. Measured in a straight line, [Coronade Twins](https://www.jbproperties.my/project/coronade-twins) is about 350 m and [Aethera Residences](https://www.jbproperties.my/project/aethera-residences) about 400 m from the station; the Causewayz Square towers are within about 900 m.

## Daily life around the listed homes

From the developer records and OpenStreetMap:

- **Shopping.** Komtar JBCC and Johor Bahru City Square are within about 650 m of the city-centre projects; R&F Mall is part of Princess Cove; Pelangi Leisure Mall is about 560 m from M Grand Minori.
- **Schools.** Foon Yew High School appears on most developers' lists for the city-centre projects; St. Joseph primary schools are within about 300 m of Coronade Twins and Aethera Residences.
- **Clinics.** KPJ Medical Suites is about 100 m from Coronade Twins; the other projects list clinics within about a kilometre.

## Things to plan for

- **Working hours in Singapore, address in Malaysia.** Confirm your employer has no objection and keep your Singapore tax and CPF matters in order.
- **Vehicle.** If you keep a Singapore-registered car, the rules for driving it into Malaysia, and a Malaysian car into Singapore, both apply.
- **Healthcare.** Singapore schemes generally do not cover treatment in Malaysia; check your insurance.

## FAQ

#### How long does the commute take today?

It depends on the crossing, the hour and the mode. There is no reliable single figure, which is why we suggest trying your intended route before buying.

#### Which listed projects are closest to the RTS station?

Coronade Twins at about 350 m and Aethera Residences at about 400 m, in a straight line from the project coordinates.`
  },
  {
    title: "New Launches Near Bukit Chagar RTS Station: The Nine Listed Projects Compared",
    slug: "new-launch-property-projects-near-rts",
    date: "May 28, 2026",
    updated: UPDATED,
    category: "RTS Link",
    readTime: "3 min read",
    summary: "All nine listed Johor Bahru new launches in one table: straight-line distance to Bukit Chagar station, developer price from, unit sizes, number of units and completion year.",
    image: greenHero("m-grand-minori"),
    imageAlt: "M Grand Minori, Taman Pelangi, Johor Bahru",
    seoTitle: "New Launches Near Bukit Chagar RTS Station Compared | jbpropertyportal.my",
    metaDescription: "Compare the nine Johor Bahru new launches near Bukit Chagar RTS station: measured distance to the station, developer price from, built-up range, units and completion year, with links to the official listings.",
    relatedProjects: ["coronade-twins", "aethera-residences", "dover-tower", "brixton-tower", "axis-tower", "princess-cove-phase-3", "princess-cove-phase-2", "m-grand-minori", "gen-sphere"],
    content: `One table, nine projects. Distances are straight lines from the project coordinates to Bukit Chagar RTS station, measured on OpenStreetMap; a walk is longer. Prices are the developers' indicative "from" prices as updated in September 2026. Floor plans, photos and full details are on each listing page.

| Project | To Bukit Chagar | From (RM) | Built-up (sq ft) | Units | Completion |
|---|---|---|---|---|---|
| [Coronade Twins](https://www.jbproperties.my/project/coronade-twins) | about 350 m | 476,000 | 280–1,230 | 539 | 2030 |
| [Aethera Residences](https://www.jbproperties.my/project/aethera-residences) | about 400 m | 1,200,000 | 650–2,594 | 786 | 2029 |
| [Causewayz Square – Dover Tower](https://www.jbproperties.my/project/dover-tower) | about 760 m | 727,500 | 474–850 | 1,200 | 2029 |
| [Causewayz Square – Brixton Tower](https://www.jbproperties.my/project/brixton-tower) | about 840 m | 691,000 | 474–850 | 1,200 | 2029 |
| [Causewayz Square – Axis Tower](https://www.jbproperties.my/project/axis-tower) | about 870 m | 580,300 | 366–592 | 1,100 | 2029 |
| [Princess Cove Phase 3](https://www.jbproperties.my/project/princess-cove-phase-3) | about 1.1 km | 720,000 | 314–1,556 | 4,385 | 2027 |
| [Princess Cove Phase 2](https://www.jbproperties.my/project/princess-cove-phase-2) | about 1.4 km | 690,000 | 471–1,471 | 3,724 | Completed 2023 |
| [M Grand Minori](https://www.jbproperties.my/project/m-grand-minori) | about 1.9 km | 300,000 | 403–835 | 1,733 | 2030 |
| [Gen Sphere](https://www.jbproperties.my/project/gen-sphere) | pending | 550,000 | 459–755 | 996 | 2029 |

## Reading the table

- **Distance** is the station as the crow flies. Developers of Aethera Residences, Causewayz Square and Princess Cove Phase 2 each describe a covered link to the station or the customs complex; treat those as developer statements until the links open.
- **Gen Sphere's** distance is withheld until its coordinates on the project sheet are confirmed.
- **Price from** is the lowest unit on the developer's list, not the price of a typical unit. Foreign buyers should check the Johor minimum purchase price for foreigners against the unit they want.
- **Units** ranges from 539 at Coronade Twins to 4,385 at Princess Cove Phase 3. Large schemes bring more facilities and more neighbours.
- **Completion** is the developer's target. Only Princess Cove Phase 2 is completed.

## Same facts, other views

The area guide sorts these projects by neighbourhood, and the RTS Link article explains what the line is and when it is targeted to open.

## FAQ

#### Which new launch is nearest Bukit Chagar RTS station?

Coronade Twins, about 350 m in a straight line, then Aethera Residences at about 400 m.

#### Which is the cheapest to enter?

M Grand Minori lists units from RM300,000; note that units below the Johor foreign-buyer threshold are for Malaysian buyers.`
  }
];

export const areaGuides: AreaGuide[] = [
  {
    name: "Johor Bahru City Centre and IIBD",
    slug: "johor-bahru",
    where: "The blocks around the Sultan Iskandar customs complex, Bukit Chagar RTS station and the planned Ibrahim International Business District.",
    description: "Johor Bahru's city centre is the Malaysian end of the Causeway. The customs, immigration and quarantine complex sits at the waterfront, Bukit Chagar RTS station is being built beside it, and the Ibrahim International Business District is the state's planned financial district to the north-west, anchored by Coronation Square. Two listed projects sit inside IIBD and three more within a kilometre of the station.",
    highlights: [
      "Bukit Chagar RTS station: about 350 m from Coronade Twins and 400 m from Aethera Residences in a straight line (OpenStreetMap)",
      "Malls within about 650 m of the listed projects: Komtar JBCC, Johor Bahru City Square",
      "Both IIBD projects are freehold serviced apartments due in 2029 and 2030 according to the developers"
    ],
    projectSlugs: ["coronade-twins", "aethera-residences", "dover-tower", "brixton-tower", "axis-tower"],
    updated: UPDATED
  },
  {
    name: "Around the CIQ: Lumba Kuda and Tanjung Puteri",
    slug: "ciq",
    where: "The streets immediately west and south-east of the Sultan Iskandar Building, the Johor Bahru customs complex at the Causeway.",
    description: "The Sultan Iskandar Building handles road traffic across the Causeway. Lumba Kuda, to its west, holds EXSIM's three Causewayz Square towers; the Tanjung Puteri waterfront, to its south-east, holds R&F's Princess Cove. These are the closest listed homes to the checkpoint itself, between about 130 m and 650 m in a straight line.",
    highlights: [
      "Closest listed project to the checkpoint: Causewayz Square Dover Tower, about 130 m (straight line)",
      "Princess Cove Phase 2 is the only completed project on the list (2023); Phase 3 is due in 2027",
      "Developers state covered links to the complex: EXSIM 600 m, R&F 650 m (developer statements, not yet open)"
    ],
    projectSlugs: ["dover-tower", "brixton-tower", "axis-tower", "princess-cove-phase-3", "princess-cove-phase-2"],
    updated: UPDATED
  },
  {
    name: "Bukit Chagar RTS Station Area",
    slug: "bukit-chagar",
    where: "Bukit Chagar is the hill beside the customs complex where the Johor Bahru RTS Link station is being built.",
    description: "Bukit Chagar station is the Malaysian terminus of the RTS Link to Woodlands North. Immigration for both countries will be cleared here before boarding, and the operator describes the ride as about five minutes. Every listed project in the city centre is within about 1.4 km of the station; the two IIBD projects are the closest.",
    highlights: [
      "Ride to Woodlands North: about five minutes according to the operator; passenger service targeted for around the end of 2026",
      "Within 500 m in a straight line: Coronade Twins (about 350 m) and Aethera Residences (about 400 m)",
      "Within 1 km: the three Causewayz Square towers (about 760 m to 870 m)"
    ],
    projectSlugs: ["coronade-twins", "aethera-residences", "dover-tower", "brixton-tower", "axis-tower"],
    updated: UPDATED
  },
  {
    name: "The RTS Link Corridor",
    slug: "rts",
    where: "The route of the Johor Bahru–Singapore Rapid Transit System Link, from Bukit Chagar to Woodlands North.",
    description: "The RTS Link is a short cross-border rail line with one station on each side of the strait. It is not a metro line through Johor Bahru, so 'near the RTS' means near Bukit Chagar. This page lists every project on our listing site by measured distance to that station, with Gen Sphere withheld until its coordinates are confirmed.",
    highlights: [
      "Two stations only: Bukit Chagar (Johor Bahru) and Woodlands North (Singapore)",
      "Capacity described by the operator: up to 10,000 passengers per hour each way",
      "Eight listed projects measured between about 350 m and 1.9 km from Bukit Chagar"
    ],
    projectSlugs: ["coronade-twins", "aethera-residences", "dover-tower", "brixton-tower", "axis-tower", "princess-cove-phase-3", "princess-cove-phase-2", "m-grand-minori"],
    updated: UPDATED
  },
  {
    name: "Iskandar Puteri",
    slug: "iskandar-puteri",
    where: "The western part of the Johor Bahru conurbation, around the Second Link to Tuas, Puteri Harbour and EduCity.",
    description: "Iskandar Puteri is the planned township west of the city centre, reached from Singapore by the Second Link rather than the Causeway. It holds Puteri Harbour, Legoland Malaysia and the EduCity campus cluster. None of the nine projects currently on our listing site is in Iskandar Puteri; buyers who want this area can ask us directly, and this page will be updated when a listing is added.",
    highlights: [
      "Crossing: Second Link (Tuas), not the Causeway or the RTS Link",
      "Landmarks: Puteri Harbour, Legoland Malaysia, EduCity",
      "Listed projects here: none at present"
    ],
    projectSlugs: [],
    updated: UPDATED
  }
];

export const developerProfiles: DeveloperProfile[] = [
  {
    name: "UOA Group",
    slug: "uoa-group",
    description: "UOA Group (UOA Development Bhd) is a Malaysian property developer listed on Bursa Malaysia, best known for its Kuala Lumpur commercial and residential developments including Bangsar South. In Johor Bahru its listed project is Aethera Residences in the Ibrahim International Business District, a freehold serviced apartment tower of 786 units due in 2029 according to the developer.",
    projectSlugs: ["aethera-residences"],
    updated: UPDATED
  },
  {
    name: "EXSIM Group",
    slug: "exsim-group",
    description: "EXSIM Group is a Malaysian developer with a track record of high-rise residential projects in the Klang Valley, including Millerz Square and The Rainz. In Johor Bahru it is building Causewayz Square in Lumba Kuda, beside the customs complex: Axis Tower, which the developer positions for short-term rental with an operator, and Brixton and Dover Towers for owner-occupiers, all freehold and due in 2029 according to the developer.",
    projectSlugs: ["axis-tower", "brixton-tower", "dover-tower"],
    updated: UPDATED
  },
  {
    name: "R&F Development",
    slug: "r-f-development",
    description: "R&F Development Sdn Bhd is the Malaysian arm of the Chinese developer R&F Properties. Its Johor Bahru project is Princess Cove, a waterfront development on reclaimed land at Tanjung Puteri beside the Causeway, sold in phases. Phase 2 is completed (2023) and Phase 3 is due in 2027 according to the developer; both are freehold, and R&F Mall is part of the development.",
    projectSlugs: ["princess-cove-phase-2", "princess-cove-phase-3"],
    updated: UPDATED
  },
  {
    name: "Mah Sing Group",
    slug: "mah-sing-group",
    description: "Mah Sing Group Bhd is a Malaysian developer listed on Bursa Malaysia with projects across the Klang Valley, Johor, Penang and Sabah, many under its M-series brand. Its listed Johor Bahru project is M Grand Minori in Taman Pelangi, a freehold serviced apartment development of 1,733 units due in 2030 according to the developer, with a shuttle bus to the customs complex stated by the developer.",
    projectSlugs: ["m-grand-minori"],
    updated: UPDATED
  }
];
