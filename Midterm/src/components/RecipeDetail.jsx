import { useState, useEffect } from "react";
import { fetchRecipeById } from "../api/recipesApi";

export default function RecipeDetail({ recipeId, onBack }) {
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setStatus("loading");
    setError(null);

    fetchRecipeById(recipeId)
      .then((data) => {
        if (!ignore) {
          setRecipe(data);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setStatus("error");
        }
      });

    return () => {
      ignore = true;
    };
  }, [recipeId]);

  if (status === "loading") {
    return <div className="status-message loading">Loading recipe...</div>;
  }

  if (status === "error") {
    return <div className="status-message error">Error: {error}</div>;
  }

  if (!recipe) return null;

  return (
    <div className="recipe-detail">
      <button className="back-button" onClick={onBack}>
        Back to list
      </button>

      <h2>{recipe.title}</h2>

      <div className="recipe-detail-meta">
        <span className="recipe-badge">{recipe.category}</span>
        <span>{recipe.cuisine}</span>
        <span>{recipe.time} min</span>
        <span>{recipe.servings} servings</span>
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