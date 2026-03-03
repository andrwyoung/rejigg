export type IndustryTag =
  | "aerospace"
  | "agency"
  | "auto-body"
  | "automotive"
  | "b2b-services"
  | "car-wash"
  | "cnc-machining"
  | "coatings"
  | "commercial"
  | "defense"
  | "dental"
  | "digital-marketing"
  | "dtc"
  | "e-commerce"
  | "facility-services"
  | "financial-services"
  | "food-service"
  | "health-wellness"
  | "healthcare"
  | "home-services"
  | "hospitality"
  | "hvac"
  | "industrial-services"
  | "insurance"
  | "landscaping"
  | "laundromat"
  | "manufacturing"
  | "meal-prep"
  | "medical-practice"
  | "oil-gas"
  | "outdoor"
  | "pet-services"
  | "physical-therapy"
  | "plumbing"
  | "repair-services"
  | "residential"
  | "restaurant"
  | "retail"
  | "security"
  | "vending"
  | "veterinary";

export type Business = {
  id: string;
  name: string;
  description: string;
  asking_price: number;
  annual_revenue: number;
  annual_profit: number;
  industry_tags: IndustryTag[];
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
  target_industries: IndustryTag[];
  target_revenue_min: number | null;
  target_revenue_max: number | null;
  date_joined: string;
};
