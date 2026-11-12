import { Link, useSearchParams } from "react-router";
import { fetchStats, fetchFilterOptions } from "../services/service";
import { useFetch } from "../hooks/useFetch";

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Breakdown({ title, rows, buildLink }) {
  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <div className="breakdown">
      <h3>{title}</h3>
      <ul className="breakdown-list">
        {rows.map((row) => (
          <li key={row.label} className="breakdown-row">
            <span className="breakdown-label">
              {buildLink ? (
                <Link to={buildLink(row)}>{capitalize(row.label)}</Link>
              ) : (
                capitalize(row.label)
              )}
            </span>
            <span className="breakdown-bar">
              <span
                className="breakdown-fill"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </span>
            <span className="breakdown-count">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const { data: options } = useFetch(() => fetchFilterOptions(), []);
  const categories = options?.categories ?? [];

  const { data: stats, status, error } = useFetch(
    () => fetchStats({ category }),
    [category]
  );

  function handleCategoryChange(value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("category", value);
    } else {
      next.delete("category");
    }
    setSearchParams(next);
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="dashboard-filter">
        <label htmlFor="dashboard-category">Showing stats for</label>
        <select
          id="dashboard-category"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {capitalize(cat)}
            </option>
          ))}
        </select>

        {category && (
          <Link to={`/recipes?category=${category}`} className="btn-link">
            View these recipes
          </Link>
        )}
      </div>

      {status === "loading" && (
        <div className="status-message loading">Calculating statistics...</div>
      )}

      {status === "error" && (
        <div className="status-message error">Error: {error.message}</div>
      )}

      {status === "success" && stats.totals.recipes === 0 && (
        <div className="status-message empty">
          No recipes in this category yet.
        </div>
      )}

      {status === "success" && stats.totals.recipes > 0 && (
        <>
          <div className="stat-grid">
            <div className="stat-tile">
              <span className="stat-value">{stats.totals.recipes}</span>
              <span className="stat-label">Recipes</span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">{stats.totals.cuisines}</span>
              <span className="stat-label">Cuisines</span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">{stats.totals.avgTime}</span>
              <span className="stat-label">Avg. minutes</span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">{stats.totals.avgServings}</span>
              <span className="stat-label">Avg. servings</span>
            </div>
            <div className="stat-tile">
              <span className="stat-value">{stats.totals.avgIngredients}</span>
              <span className="stat-label">Avg. ingredients</span>
            </div>
          </div>

          <div className="breakdown-grid">
            <Breakdown
              title="By category"
              rows={stats.byCategory}
              buildLink={(row) => `/recipes?category=${row.label}`}
            />
            <Breakdown
              title="Top cuisines"
              rows={stats.byCuisine}
              buildLink={(row) => `/recipes?cuisine=${row.label}`}
            />
            <Breakdown title="By cooking time" rows={stats.byTime} />
          </div>

          <div className="quickest">
            <h3>Quickest to cook</h3>
            <ul className="quickest-list">
              {stats.quickest.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                  <span className="quickest-time">{recipe.time} min</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}