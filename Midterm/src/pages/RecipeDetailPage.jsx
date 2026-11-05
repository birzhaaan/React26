import { useParams, useNavigate, Link } from "react-router";
import { fetchRecipeById } from "../services/service";
import { useFetch } from "../hooks/useFetch";

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

  const notFound = status === "error" && error?.message === "Recipe not found";

  if (status === "loading") {
    return <div className="status-message loading">Loading recipe...</div>;
  }

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

  if (status === "error") {
    return <div className="status-message error">Error: {error.message}</div>;
  }

  if (!recipe) return null;

  return (
    <div className="recipe-detail">
      <div className="detail-links">
        <button className="btn-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <Link to="/recipes" className="btn-link">All Recipes</Link>
      </div>

      <h2>{recipe.title}</h2>

      <div className="recipe-detail-meta">
        <span className="recipe-badge">{recipe.category}</span>
        <span>{recipe.cuisine}</span>
        <span>{recipe.time} min</span>
        <span>{recipe.servings} servings</span>
        <span>{recipe.ingredients.length} ingredients</span>
      </div>

      <div className="recipe-detail-section">
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-detail-section">
        <h3>Instructions</h3>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
}