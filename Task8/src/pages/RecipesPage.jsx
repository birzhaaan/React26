import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRecipesList,
  selectRecipesStatus,
  selectRecipesError,
  selectRecipesFromCache,
} from "../features/recipes/recipesSlice";
import { selectRecipeListView, selectPagination } from "../store/selectors";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import RecipeList from "../components/RecipeList";
import RecipeForm from "../components/RecipeForm";
import Pagination from "../components/Pagination";
import StatusMessage from "../components/StatusMessage";

export default function RecipesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const maxTime = searchParams.get("maxTime") || "";
  const sortBy = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const hasFilters = Boolean(search || category || cuisine || maxTime || sortBy);

  const recipes = useSelector(selectRecipeListView);
  const status = useSelector(selectRecipesStatus);
  const error = useSelector(selectRecipesError);
  const fromCache = useSelector(selectRecipesFromCache);
  const { totalItems, totalPages } = useSelector(selectPagination);

  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const updateParams = useCallback(
    (changes, options = {}) => {
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
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== searchInput) return;
    if (debouncedSearch === search) return;

    updateParams({ search: debouncedSearch }, { replace: true });
  }, [debouncedSearch, searchInput, search, updateParams]);

  useEffect(() => {
    dispatch(
      fetchRecipesList({ search, category, cuisine, maxTime, sortBy, page })
    );
  }, [dispatch, search, category, cuisine, maxTime, sortBy, page]);

  function resetFilters() {
    setSearchParams(new URLSearchParams());
  }

  function retryFetch() {
    dispatch(
      fetchRecipesList({ search, category, cuisine, maxTime, sortBy, page })
    );
  }

  function handleRecipeAdded() {
    setShowForm(false);
    resetFilters();
  }

  return (
    <div className="recipes-page">
      <h1>All Recipes</h1>

      <div className="controls">
        <SearchBar value={searchInput} onChange={setSearchInput} />

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
        status={status === "succeeded" ? "success" : status}
        error={error}
        isEmpty={status === "succeeded" && recipes.length === 0}
      />

      {status === "failed" && (
        <div className="retry-row">
          <button className="btn-primary" onClick={retryFetch}>
            Try again
          </button>
        </div>
      )}

      {status === "succeeded" && recipes.length > 0 && (
        <>
          <p className="results-count">
            {totalItems} {totalItems === 1 ? "recipe" : "recipes"} found
            {fromCache && <span className="cache-badge">from cache</span>}
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