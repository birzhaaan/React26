import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRecipeDetail,
  detailCleared,
  selectRecipe,
  selectRelatedRecipes,
  selectDetailStatus,
  selectDetailError,
} from "../features/recipeDetail/recipeDetailSlice";
import {
  getDifficulty,
  capitalize,
  splitSteps,
  scaleIngredient,
} from "../utils/recipe";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const recipeId = Number(id);
  const isValidId = Number.isInteger(recipeId) && recipeId > 0;

  const recipe = useSelector(selectRecipe);
  const related = useSelector(selectRelatedRecipes);
  const status = useSelector(selectDetailStatus);
  const error = useSelector(selectDetailError);

  const [servings, setServings] = useState(null);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (!isValidId) return;

    dispatch(fetchRecipeDetail(recipeId));

    return () => {
      dispatch(detailCleared());
    };
  }, [dispatch, recipeId, isValidId]);

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

  const notFound =
    !isValidId || (status === "failed" && error === "Recipe not found");

  if (notFound) {
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

  if (status === "failed") {
    return <div className="status-message error">Error: {error}</div>;
  }

  if (!recipe) {
    return <div className="status-message loading">Loading recipe...</div>;
  }

  const factor = servings ? servings / recipe.servings : 1;
  const steps = splitSteps(recipe.instructions);

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
          <p className="detail-subtitle">{capitalize(recipe.cuisine)} cuisine</p>
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

      {related.length > 0 && (
        <section className="related">
          <h3>More {recipe.category} recipes</h3>
          <div className="related-list">
            {related.map((item) => (
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