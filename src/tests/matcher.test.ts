import { describe, it, expect } from "vitest";
import { computeMatchScore } from "../lib/matcher";
import { Buyer, Business, IndustryTag } from "../types/buyers";

const baseBusiness: Business = {
  id: "business-1",
  name: "jonadrew",
  description: "drawing",
  asking_price: 500_000,
  annual_revenue: 1_000_000,
  annual_profit: 200_000,
  industry_tags: ["plumbing", "home-services"],
  state: "america",
  date_listed: "date",
  owner_name: "jona",
};

const baseBuyer: Buyer = {
  id: "buyer-1",
  name: "rob",
  email: "bob@bob.com",
  buyer_type: "individual",
  target_industries: ["plumbing", "hvac"],
  target_revenue_min: 500_000,
  target_revenue_max: 2_000_000,
  date_joined: "date",
};

// hard eligibility

describe("eligibility", () => {
  it("eligible: revenue is within range", () => {
    const result = computeMatchScore(baseBuyer, baseBusiness);
    expect(result.eligible).toBe(true);
  });

  it("ineligible: revenue is below range", () => {
    const biz = { ...baseBusiness, annual_revenue: 100_000 };
    const result = computeMatchScore(baseBuyer, biz);
    expect(result.eligible).toBe(false);
  });

  it("ineligible: revenue is above range", () => {
    const biz = { ...baseBusiness, annual_revenue: 5_000_000 };
    const result = computeMatchScore(baseBuyer, biz);
    expect(result.eligible).toBe(false);
  });
});

// soft ranking

describe("score", () => {
  it("scores 0: no industry overlap", () => {
    const buyer = {
      ...baseBuyer,
      target_industries: ["restaurant", "dental"] as IndustryTag[],
    };
    const result = computeMatchScore(buyer, baseBusiness);
    expect(result.score).toBe(0);
  });

  it("scores 1: industries are an exact match", () => {
    const buyer = {
      ...baseBuyer,
      target_industries: ["plumbing", "home-services"] as IndustryTag[],
    };
    const result = computeMatchScore(buyer, baseBusiness);
    expect(result.score).toBe(1);
  });
});
