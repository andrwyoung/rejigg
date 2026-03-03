import { Business, Buyer } from "../types/buyers";
import { MatchScore } from "../types/matching";

export function computeMatchScore(
  buyer: Buyer,
  business: Business,
): MatchScore {
  const reasons: string[] = [];
  let eligible = true;

  // hard filter: can this buyer even buy the business at all?
  if (buyer.target_revenue_min != null && buyer.target_revenue_max != null) {
    if (
      business.annual_revenue < buyer.target_revenue_min ||
      business.annual_revenue > buyer.target_revenue_max
    ) {
      eligible = false;
      reasons.push("Revenue out of target range");
    }
  }

  // soft ranking: how well do they overlap industries?
  let score = 0;
  const buyerTags = new Set(buyer.target_industries || []);
  const bizTags = new Set(business.industry_tags || []);
  const overlap = [...buyerTags].filter((t) => bizTags.has(t));
  const union = new Set([...buyerTags, ...bizTags]);

  if (union.size > 0) {
    score = overlap.length / union.size;
    if (overlap.length > 0) {
      reasons.push(`Industry match: ${overlap.join(", ")}`);
    }
  }

  if (reasons.length === 0) {
    reasons.push("No strong match signals");
  }

  return {
    buyer_id: buyer.id,
    business_id: business.id,
    business_name: business.name,
    reasons,

    eligible,
    score: Math.round(score * 1000) / 1000,
  };
}
