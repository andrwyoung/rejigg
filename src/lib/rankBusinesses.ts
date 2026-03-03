import { Buyer, Business } from "../types/buyers";
import { MatchScore } from "../types/matching";
import { computeMatchScore } from "./matcher";

export type RankListType = {
  business_id: string;
  buyer: Buyer;
  score: number;
  eligible: boolean;
};

/*
 sort all businesses:
 - all eligible businesses are grouped together and shown first
 - within each group, sort them by their ranking
*/
export function rankBusinessesForBuyer(
  buyer: Buyer,
  businesses: Business[],
): RankListType[] {
  return businesses
    .map((business) => {
      const matchScore: MatchScore = computeMatchScore(buyer, business);
      return { business_id: business.id, buyer, score: matchScore.score, eligible: matchScore.eligible };
    })
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.score - a.score;
    });
}
