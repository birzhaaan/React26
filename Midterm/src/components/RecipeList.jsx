import RecipeCard from "./RecipeCard";

export default function RecipeList({ recipes, onSelectRecipe }) {
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
      ))}
    </div>
  );
}