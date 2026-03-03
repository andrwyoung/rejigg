import { fmt } from "../utils";

export default function MatchCard({ business, match }) {
  const ineligible = match?.eligible === false;
  return (
    <div className={`match-card${ineligible ? " match-card--ineligible" : ""}`}>
      <div className="match-info">
        <div className="match-name">{business.name}</div>
        <div className="match-description">{business.description}</div>
        <div className="match-meta">
          {business.state} &middot; ${fmt(business.annual_revenue)} revenue
          &middot; ${fmt(business.asking_price)} asking
        </div>
        <div className="match-tags">
          {(business.industry_tags || []).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      {ineligible && <span className="badge-ineligible">Out of range</span>}
    </div>
  );
}
