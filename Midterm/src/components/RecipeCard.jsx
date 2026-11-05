import { Link } from "react-router";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="recipe-card-header">
        <h3>{recipe.title}</h3>
        <span className="recipe-badge">{recipe.category}</span>
      </div>
      <div className="recipe-card-meta">
        <div className="meta-item">
          <span className="meta-label">Time</span>
          <span className="meta-value">{recipe.time} min</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Serves</span>
          <span className="meta-value">{recipe.servings}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Cuisine</span>
          <span className="meta-value">{recipe.cuisine}</span>
        </div>
      </div>
      <div className="recipe-card-ingredients">
        {recipe.ingredients.slice(0, 3).join(", ")}
        {recipe.ingredients.length > 3 && "..."}
      </div>
    </Link>
  );
}