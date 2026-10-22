import { useState } from "react";
import { createRecipe } from "../api/recipesApi";

const CATEGORIES = ["breakfast", "lunch", "dinner", "dessert", "snack"];

export default function RecipeForm({ onRecipeAdded }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("breakfast");
  const [cuisine, setCuisine] = useState("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !cuisine.trim() || !ingredients.trim() || !instructions.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const newRecipe = {
      title: title.trim(),
      category,
      cuisine: cuisine.trim().toLowerCase(),
      time: Number(time) || 0,
      servings: Number(servings) || 1,
      ingredients: ingredients.split(",").map((i) => i.trim()).filter(Boolean),
      instructions: instructions.trim(),
    };

    setStatus("loading");
    setError(null);

    createRecipe(newRecipe)
      .then(() => {
        setStatus("success");
        setTitle("");
        setCuisine("");
        setTime("");
        setServings("");
        setIngredients("");
        setInstructions("");
        onRecipeAdded();
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>Add New Recipe</h2>

      <label>
        Title *
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Recipe title" />
      </label>

      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cuisine *
        <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="e.g. italian" />
      </label>

      <label>
        Cooking Time (min)
        <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 30" min="0" />
      </label>

      <label>
        Servings
        <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g. 4" min="1" />
      </label>

      <label>
        Ingredients * (comma-separated)
        <input value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="flour, eggs, milk" />
      </label>

      <label>
        Instructions *
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Step by step instructions..." rows={3} />
      </label>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Adding..." : "Add Recipe"}
      </button>

      {status === "success" && <p className="form-success">Recipe added successfully!</p>}
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}