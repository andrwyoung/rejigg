export type Business = {
  id: string;
  name: string;
  description: string;
  asking_price: number;
  annual_revenue: number;
  annual_profit: number;
  industry_tags: string[];
  state: string;
  date_listed: string;
  owner_name: string;
};

export type BuyerType = "individual" | "pe_firm" | "strategic";

export type Buyer = {
  id: string;
  name: string;
  email: string;
  buyer_type: BuyerType;
  target_industries: string[];
  target_revenue_min: number | null;
  target_revenue_max: number | null;
  date_joined: string;
};
