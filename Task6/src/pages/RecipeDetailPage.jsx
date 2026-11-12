import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { fetchRecipeById, fetchRecipes } from "../services/service";
import { useFetch } from "../hooks/useFetch";

function getDifficulty(recipe) {
  const score = recipe.time / 10 + recipe.ingredients.length;
  if (score <= 8) return "Easy";
  if (score <= 14) return "Medium";
  return "Advanced";
}

function scaleIngredient(text, factor) {
  if (factor === 1) return text;

  const match = text.match(/^(\d+(?:\.\d+)?)/);
  if (!match) return text;

  const scaled = Number(match[1]) * factor;
  const rounded = Math.round(scaled * 100) / 100;

  return rounded + text.slice(match[1].length);
}

function splitSteps(instructions) {
  return instructions
    .split(/(?<=\.)\s+/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const recipeId = Number(id);
  const isValidId = Number.isInteger(recipeId) && recipeId > 0;

  const { data: recipe, status, error } = useFetch(
    () =>
      isValidId
        ? fetchRecipeById(recipeId)
        : Promise.reject(new Error("Recipe not found")),
    [recipeId]
  );

  const { data: related } = useFetch(
    () =>
      recipe
        ? fetchRecipes({ category: recipe.category, perPage: 4 })
        : Promise.resolve(null),
    [recipe?.id, recipe?.category]
  );

  const [servings, setServings] = useState(null);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
      setChecked([]);
    }
  }, [recipe]);

  function toggleIngredient(index) {
    setChecked((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index]
    );
  }

  if (status === "loading") {
    return <div className="status-message loading">Loading recipe...</div>;
  }

  if (status === "error" && error?.message === "Recipe not found") {
    return (
      <div className="recipe-detail">
        <div className="status-message empty">Recipe #{id} does not exist.</div>
        <div className="detail-links">
          <Link to="/recipes" className="btn-link">All Recipes</Link>
          <Link to="/" className="btn-link">Home</Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <div className="status-message error">Error: {error.message}</div>;
  }

  if (!recipe) return null;

  const factor = servings ? servings / recipe.servings : 1;
  const steps = splitSteps(recipe.instructions);
  const suggestions = (related?.recipes ?? [])
    .filter((item) => item.id !== recipe.id)
    .slice(0, 3);

  return (
    <article className="recipe-detail">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/recipes">Recipes</Link>
        <span>/</span>
        <span className="breadcrumb-current">{recipe.title}</span>
      </nav>

      <header className="detail-header">
        <div>
          <span className="recipe-badge">{recipe.category}</span>
          <h2>{recipe.title}</h2>
          <p className="detail-subtitle">
            {recipe.cuisine.charAt(0).toUpperCase() + recipe.cuisine.slice(1)} cuisine
          </p>
        </div>

        <div className="detail-actions">
          <button className="btn-link" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <Link to="/recipes" className="btn-link">All Recipes</Link>
        </div>
      </header>

      <div className="detail-stats">
        <div className="detail-stat">
          <span className="detail-stat-value">{recipe.time}</span>
          <span className="detail-stat-label">minutes</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{recipe.servings}</span>
          <span className="detail-stat-label">servings</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{recipe.ingredients.length}</span>
          <span className="detail-stat-label">ingredients</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{steps.length}</span>
          <span className="detail-stat-label">steps</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{getDifficulty(recipe)}</span>
          <span className="detail-stat-label">difficulty</span>
        </div>
      </div>

      <div className="detail-columns">
        <section className="detail-panel">
          <div className="panel-head">
            <h3>Ingredients</h3>
            <div className="servings-control">
              <button
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                disabled={servings <= 1}
                aria-label="Fewer servings"
              >
                −
              </button>
              <span>{servings} serv.</span>
              <button
                onClick={() => setServings((s) => Math.min(20, s + 1))}
                disabled={servings >= 20}
                aria-label="More servings"
              >
                +
              </button>
            </div>
          </div>

          {factor !== 1 && (
            <p className="scale-note">
              Amounts scaled from {recipe.servings} servings
            </p>
          )}

          <ul className="ingredient-list">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                <label className={checked.includes(index) ? "done" : ""}>
                  <input
                    type="checkbox"
                    checked={checked.includes(index)}
                    onChange={() => toggleIngredient(index)}
                  />
                  <span>{scaleIngredient(ing, factor)}</span>
                </label>
              </li>
            ))}
          </ul>

          <p className="checklist-progress">
            {checked.length} of {recipe.ingredients.length} ready
          </p>
        </section>

        <section className="detail-panel">
          <h3>Instructions</h3>
          <ol className="step-list">
            {steps.map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {suggestions.length > 0 && (
        <section className="related">
          <h3>More {recipe.category} recipes</h3>
          <div className="related-list">
            {suggestions.map((item) => (
              <Link
                key={item.id}
                to={`/recipes/${item.id}`}
                className="related-card"
              >
                <span className="related-title">{item.title}</span>
                <span className="related-meta">
                  {item.cuisine} · {item.time} min
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}