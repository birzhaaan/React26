import { useState, useEffect } from "react";
import { fetchRecipes } from "./api/recipesApi";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";
import RecipeForm from "./components/RecipeForm";
import Pagination from "./components/Pagination";
import StatusMessage from "./components/StatusMessage";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let ignore = false;

    setStatus("loading");
    setError(null);

    fetchRecipes({ search, category, sortBy, page })
      .then((data) => {
        if (!ignore) {
          setRecipes(data.recipes);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
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
  }, [search, category, sortBy, page]);

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setPage(1);
  }

  function handleSortChange(value) {
    setSortBy(value);
    setPage(1);
  }

  function handleRecipeAdded() {
    setShowForm(false);
    setSearch("");
    setCategory("");
    setSortBy("");
    setPage(1);
  }

  if (selectedRecipeId) {
    return (
      <div className="app">
        <h1>Recipe Finder</h1>
        <RecipeDetail
          recipeId={selectedRecipeId}
          onBack={() => setSelectedRecipeId(null)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Recipe Finder</h1>

      <div className="controls">
        <SearchBar value={search} onChange={handleSearchChange} />
        <FilterBar
          category={category}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
        <button
          className="toggle-form-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Recipe"}
        </button>
      </div>

      {showForm && <RecipeForm onRecipeAdded={handleRecipeAdded} />}

      <StatusMessage
        status={status}
        error={error}
        isEmpty={status === "success" && recipes.length === 0}
      />

      {status === "success" && recipes.length > 0 && (
        <>
          <p className="results-count">{totalItems} recipes found</p>
          <RecipeList recipes={recipes} onSelectRecipe={setSelectedRecipeId} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}