export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect("")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          active === "" ? "bg-chili-500 text-white" : "bg-white text-ink-600 border border-ink-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
            active === category
              ? "bg-chili-500 text-white"
              : "bg-white text-ink-600 border border-ink-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
