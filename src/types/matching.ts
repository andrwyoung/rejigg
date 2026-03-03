export type MatchScore = {
  buyer_id: string;
  business_id: string;
  business_name: string;
  reasons: string[];

  eligible: boolean; // should this business even be eligible?
  score: number; // 0-1
};
