const CATEGORIES = ["", "breakfast", "lunch", "dinner", "dessert", "snack"];
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "time-asc", label: "Time: Low to High" },
  { value: "time-desc", label: "Time: High to Low" },
  { value: "servings-asc", label: "Servings: Low to High" },
  { value: "servings-desc", label: "Servings: High to Low" },
];

export default function FilterBar({ category, onCategoryChange, sortBy, onSortChange }) {
  return (
    <div className="filter-bar">
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
