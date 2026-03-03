# Design

## Overview

This is a two sided marketplace problem: how do we match up buyers and sellers so a sale happens?

What we know about sellers:

- They want to sell their businesses; listing your business on this website signals some intent.
- They want high quality inquiries. Every low quality conversation decreases trust in the platform
- They are willing to leave if the friction gets too high

**We need sellers.** If they leave, then we ourselves no longer have a business

What we know about buyers:

- Not all of them are here to buy businesses
  - They may be gathering data on competitors
  - They may be investors, brokers or advisors
  - They might just be curious or just want to peruse businesses
- Stakes are very low. There is very low risk for them to send messages and chat

We need buyers, but we need **high quality buyers**;
Buyer accounts are not all equal, and simply measuring how many buyer accounts we have does not give us the full picture

## Problem

Our prompt here states 3 problems:

1. Buyers in similar situations see similar rankings
2. Sellers get overwhelmed with low quality inquiries
3. The current scoring mixes everything together

At it's core, the basic problem is that: our system has no mechanism to enforce or communicate fit

Sellers are either getting spammed by

- **Low intent leads**: that weren't even interested in buying in the first place
- **Unqualified leads**: that should not have messaged in the first place (out of budget. location too far etc)

  Either way, they lose trust in us and eventually give up or look for a broker.

A better ranking or matching system would help to solve the _Unqualified leads_ problem

Better rankings means that buyers are more likely to find businesses actually in price range, the correct location or correct industry

Then sellers get buyers that are worth talking to and sales are more likely to happen

But also let's acknowledge the limitations of a ranking system:

- If our problem is that the majority of inquiries are _Low Intent leads_ (tire-kickers, data gatherers, or non-serious participants), then a ranking system doesn't solve that. That problem requires friction, verification or messaging controls, not better ordering.
- If our problem is that buyers are churning and looking else, then a ranking system may help marginally but won't address the root cause

Because of this, we might reasonably conclude that a better matching system **might** increase the quality of buyer messages, but in order to be certain, we would need more data like:

1. What do "low quality messages from buyers" even look like? Are they more low intent buyers, unqualified buyers or something else?
2. What percentage of inquiries turn into serious conversations, and is that percentage going up or down as more sellers and buyers are using the platform?

If _Unqualified Leads_ are the dominant driver, ranking is the right first lever. But if _Low Intent_ dominates, we would need to layer in qualification or verification mechanisms.

But for the sake of this problem, we'll assume that sellers are being flooded majority with _Unqualified Leads_

## Proposal

At it's core, we want to implement a filtering system that will automatically enforce or communicate best fit between buyers and sellers.

My solution is to:

1. Seperate Eligibility from Ranking
2. Collect more high ROI signals than simply budget and industry
3. Rank the buyers too

### 1 Seperate Eligibility from Ranking

Right now our score collapses every thing into one number: a business that's a perfect industry match but way out of budget gets the same score as something in budget that's just not in an industry a buyer was considering.

That just doesn't make sense

We muddy whether the buyer is _eligible_ at all versus just _well matched_.

We should split this distinction up:

1. Hard filters: does the buyer even meet the minimum criteria like buget, location and buyer type. If not, they should be clearly flagged as out of range or very heavily deprioritized
2. Ranking: among eligible business, then sort by best fit and other soft signals

### 2 Collect High Quality Signals

Right now, our listing only collects businesses's revenue and industry, but a hotel and a small catering company can both be "in hospitably with $1.5M in revenue" but are completely different acquisition profiles

We need more research:

- What do sellers wish buyers knew before messaging?
- What do serious buyers wish listings told them?

Some possible candidates to check that are typical SMB acuqisition criteria:

- Geographic flexibility (hard eligibility)

* Desired operator involvement (soft ranking)
* Timeline to acquire (soft ranking)

Then instead of burdening sellers, we can first have buyers include this information in their profile first, who are incentivized to fill it out because more complete profiles will surface them higher in seller views (explained in the following section)

### 3 Two Way Ranking

Right now, all buyers look the same to sellers. Adding a ranking that ranks buyers by things like profile completeness, response rate, preference compatibility or verified financials would let allow sellers to sort their inbox with higher intent.

A buyer trust score has 2 benefits:

1. It encourages buyers to be more engaged and professional
2. It allows sellers to quickly triage their inbox, by prioritizing verified high signal buyers over blank accounts with no track record

## Metrics

How do we know whether we've succeeded?

Our metrics should be

- **KPI:** Percent of messages that move on to serious conversation (3+ exchanges) to track if our changes actually improve the quality of the conversations.
- **Secondary Metric:** Seller engagements (weekly logins) to track whether our changes improve seller engagement
- **Guardrail Metric:** Buyer engagement (daily logins) before and after these changes to see how whether our changes negatively affect buyer retention

# Plan

Assumptions:

- Users are still using the app, thus changes must be tested before pushed out
- We are making changes to a larger codebase like Rejigg, which is a more mature codebase
- Despite implementing these features solo, we're still working within the greater team, so changes must consider features and timelines from other developers

### Week 1: Seperate Eligibility from Ranking

**High Intensity Sprint**

1. Seperate out Eligibility vs Ranking internally
   - Explicitly mark a buyer as out of budget, and then only show "out of budget" businesses after all the "in budget" businesses
   - Maintain a lighter ranking for industry match and "how close to budget"

2. Reflect those changes in the UI:
   - Show "out of range" badge for businesses out of range.
   - Have a popup that warns buyers that they aren't a perfect match for a seller, but allow them to message anyways after explicitly confirming

3. Write tests to check ranking

### Week 2: User Research

**Low Intensity Sprint**

Reach out to sellers:

- How many of your previous 10 conversations were low quality. What made them low quality
- What are the top 3 things you care about seeing in a buyer
- What do you not like about the conversations you've had?

Reach out to buyers:

- What are the top 3 things you care about seeing
- Walk me through your thinking process when you reached out to the past 2 sellers

### Week 3: Incorporate Higher Signal Questions

**Medium Intensity Sprint**

Reshape the current questions:

- "What is the most you would pay for a business?" instead of giving a range
  - But offer an optional "preffered range" as well
- "What industries are you least interested in" and "What 3 industries are you most interested in?"

Additionally, add no more than 3 new questions using research from week 2

1. Implement the schema to store their answers
2. Implement the UI to ask these questions
3. Wire up the data into buyer profiles

### Week 4: Rank the Buyers

**High Intensity Sprint**

Eventually, we want to also give sellers optional filters that would incorporate into a buyer's compatibility score, and incorporate things like

- Speed of buyer response
- How many previous verified acquisitions this buyer has had
- How often they're on our platform
  But that should be put in a different sprint

For now, we can simply just implement a ranking for how complete their profile is
Tier A: Complete profile with all optional fields complete
Tier B: Complete profile
Tier C: Minimal profile

1. Implement the algorithmn to compute the score
2. Implement the UI to show sellers the buyer score
3. Implement the UI to show buyers their score, and what they can do to improve it
4. Write tests to check the new scoring

## What I Built

I built an initial commit for week 1

0. Committed the writeup
1. Implemented eligibility cutoff for out of budget businesses `/lib/matcher.js` + Typescripted some of the files
2. Reflected ineligibility in the UI `/components/MatchCard.jsx`
3. Added a quick sanity test
