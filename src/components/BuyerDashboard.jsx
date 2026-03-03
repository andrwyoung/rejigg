import { businesses } from "../data";
import { rankBusinessesForBuyer } from "../lib/rankBusinesses";
import { fmt } from "../utils";
import MatchCard from "./MatchCard";

export default function BuyerDashboard({ buyer }) {
  const matches = rankBusinessesForBuyer(buyer, businesses);
  const tags = buyer.target_industries || [];
  const rev =
    buyer.target_revenue_min != null
      ? `$${fmt(buyer.target_revenue_min)} \u2013 $${fmt(buyer.target_revenue_max)}`
      : "No range set";

  return (
    <div className="page">
      <div className="dashboard-header">
        <h2>Recommended Businesses</h2>
        <p>Businesses ranked by how well they match your preferences.</p>
      </div>

      <div className="profile-bar">
        <div>
          <span className="label">Industries:</span>{" "}
          {tags.length > 0
            ? tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))
            : "None set"}
        </div>
        <div>
          <span className="label">Revenue range:</span> {rev}
        </div>
      </div>

      <div className="results-count">{matches.length} businesses</div>
      {matches.map((match) => {
        const biz = businesses.find((b) => b.id === match.business_id);
        return biz ? (
          <MatchCard key={biz.id} business={biz} match={match} />
        ) : null;
      })}
    </div>
  );
}
