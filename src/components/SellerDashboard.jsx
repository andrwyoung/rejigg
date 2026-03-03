import { buyers } from "../data";
import { computeMatchScore } from "../lib/matcher";
import { fmt } from "../utils";

export default function SellerDashboard({ business }) {
  const tags = business.industry_tags || [];

  const buyerMatches = buyers
    .map((buyer) => {
      const match = computeMatchScore(buyer, business);
      return { buyer, score: match.score, eligible: match.eligible };
    })
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.score - a.score;
    });

  return (
    <div className="page">
      <div className="dashboard-header">
        <h2>Your Listing</h2>
        <p>How buyers are being matched to your business.</p>
      </div>

      <div className="listing-card">
        <h3>{business.name}</h3>
        <div className="listing-meta">
          {business.state} &middot; ${fmt(business.annual_revenue)} revenue
          &middot; ${fmt(business.annual_profit)} profit &middot; $
          {fmt(business.asking_price)} asking
        </div>
        <div className="listing-description">{business.description}</div>
        <div className="listing-tags">
          {tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="section-label">
        Matched Buyers ({buyerMatches.length})
      </div>
      {buyerMatches.map(({ buyer }) => {
        const rev =
          buyer.target_revenue_min != null
            ? `$${fmt(buyer.target_revenue_min)}\u2013$${fmt(buyer.target_revenue_max)}`
            : "No range set";
        const buyerTags = (buyer.target_industries || [])
          .slice(0, 3)
          .join(", ");
        return (
          <div key={buyer.id} className="buyer-row">
            <div>
              <div className="buyer-row-name">{buyer.name}</div>
              <div className="buyer-row-detail">
                {buyerTags} &middot; {rev}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
