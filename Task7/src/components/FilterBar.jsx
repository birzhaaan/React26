import { fetchFilterOptions } from "../services/service";
import { useFetch } from "../hooks/useFetch";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "time-asc", label: "Time: Low to High" },
  { value: "time-desc", label: "Time: High to Low" },
  { value: "servings-asc", label: "Servings: Low to High" },
  { value: "servings-desc", label: "Servings: High to Low" },
];

const TIME_OPTIONS = [
  { value: "", label: "Any time" },
  { value: "15", label: "Up to 15 min" },
  { value: "30", label: "Up to 30 min" },
  { value: "60", label: "Up to 1 hour" },
];

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function FilterBar({
  category,
  onCategoryChange,
  cuisine,
  onCuisineChange,
  maxTime,
  onMaxTimeChange,
  sortBy,
  onSortChange,
}) {
  const { data } = useFetch(() => fetchFilterOptions(), []);

  const categories = data?.categories ?? [];
  const cuisines = data?.cuisines ?? [];

  return (
    <div className="filter-bar">
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {capitalize(cat)}
          </option>
        ))}
      </select>

      <select value={cuisine} onChange={(e) => onCuisineChange(e.target.value)}>
        <option value="">All Cuisines</option>
        {cuisines.map((cui) => (
          <option key={cui} value={cui}>
            {capitalize(cui)}
          </option>
        ))}
      </select>

      <select value={maxTime} onChange={(e) => onMaxTimeChange(e.target.value)}>
        {TIME_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}