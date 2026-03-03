import { useState, useMemo } from "react";
import { businesses } from "../data";
import { rankBusinessesForBuyer } from "../lib/rankBusinesses";
import MatchCard from "./MatchCard";

export default function SearchView() {
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [revMin, setRevMin] = useState("");
  const [revMax, setRevMax] = useState("");
  const [results, setResults] = useState(null);

  const allTags = useMemo(
    () => [...new Set(businesses.flatMap((b) => b.industry_tags || []))].sort(),
    [],
  );

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const search = () => {
    const min = revMin.replace(/[^0-9]/g, "");
    const max = revMax.replace(/[^0-9]/g, "");
    const buyer = {
      id: "search-user",
      name: "You",
      target_industries: [...selectedTags],
      target_revenue_min: min ? parseInt(min, 10) : null,
      target_revenue_max: max ? parseInt(max, 10) : null,
    };
    setResults(rankBusinessesForBuyer(buyer, businesses));
  };

  return (
    <div className="page">
      <div className="search-header">
        <h1>BizMatch</h1>
        <p>Find businesses for sale matching your criteria.</p>
      </div>

      <div className="search-section">
        <label>Industries</label>
        <div className="tag-grid">
          {allTags.map((tag) => (
            <div
              key={tag}
              className={`tag-toggle${selectedTags.has(tag) ? " selected" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="search-section">
        <label>Annual Revenue Range</label>
        <div className="revenue-inputs">
          <input
            type="text"
            placeholder="Min (e.g. 500000)"
            value={revMin}
            onChange={(e) => setRevMin(e.target.value)}
          />
          <span>&ndash;</span>
          <input
            type="text"
            placeholder="Max (e.g. 2000000)"
            value={revMax}
            onChange={(e) => setRevMax(e.target.value)}
          />
        </div>
      </div>

      <div className="search-actions">
        <button className="search-btn" onClick={search}>
          Search
        </button>
      </div>

      {results && (
        <div>
          <div className="results-count">{results.length} businesses</div>
          {results.map((match) => {
            const biz = businesses.find((b) => b.id === match.business_id);
            return biz ? (
              <MatchCard key={biz.id} business={biz} match={match} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
