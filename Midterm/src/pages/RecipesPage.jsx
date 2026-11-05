import { useState } from "react";
import { useSearchParams } from "react-router";
import { fetchRecipes } from "../services/service";
import { useFetch } from "../hooks/useFetch";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import RecipeList from "../components/RecipeList";
import RecipeForm from "../components/RecipeForm";
import Pagination from "../components/Pagination";
import StatusMessage from "../components/StatusMessage";

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const maxTime = searchParams.get("maxTime") || "";
  const sortBy = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const hasFilters = Boolean(search || category || cuisine || maxTime || sortBy);

  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const { data, status, error } = useFetch(
    () => fetchRecipes({ search, category, cuisine, maxTime, sortBy, page }),
    [search, category, cuisine, maxTime, sortBy, page, reloadKey]
  );

  const recipes = data?.recipes ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 0;

  function updateParams(changes, options = {}) {
    const { replace = false, keepPage = false } = options;
    const next = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(changes)) {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }

    if (!keepPage) next.delete("page");

    setSearchParams(next, { replace });
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams());
  }

  function handleRecipeAdded() {
    setShowForm(false);
    resetFilters();
    setReloadKey((key) => key + 1);
  }

  return (
    <div className="recipes-page">
      <h1>All Recipes</h1>

      <div className="controls">
        <SearchBar
          value={search}
          onChange={(value) => updateParams({ search: value }, { replace: true })}
        />
        <FilterBar
          category={category}
          onCategoryChange={(value) => updateParams({ category: value })}
          cuisine={cuisine}
          onCuisineChange={(value) => updateParams({ cuisine: value })}
          maxTime={maxTime}
          onMaxTimeChange={(value) => updateParams({ maxTime: value })}
          sortBy={sortBy}
          onSortChange={(value) => updateParams({ sort: value })}
        />

        {hasFilters && (
          <button className="btn-link" onClick={resetFilters}>
            Reset
          </button>
        )}

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
        error={error?.message}
        isEmpty={status === "success" && recipes.length === 0}
      />

      {status === "success" && recipes.length > 0 && (
        <>
          <p className="results-count">
            {totalItems} {totalItems === 1 ? "recipe" : "recipes"} found
          </p>
          <RecipeList recipes={recipes} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(value) =>
              updateParams({ page: value }, { keepPage: true })
            }
          />
        </>
      )}
    </div>
  );
}