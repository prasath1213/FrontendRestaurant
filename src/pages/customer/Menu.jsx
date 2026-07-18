import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { foodService } from "../../services/foodService";
import { useCart } from "../../context/CartContext";
import { useDebounce } from "../../hooks/useDebounce";
import FoodCard from "../../components/customer/FoodCard";
import CategoryFilter from "../../components/customer/CategoryFilter";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { getErrorMessage } from "../../utils/formatters";

// Safely extract an array from any of the common API response shapes
function extractArray(payload, key) {
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload)) return payload;
  return [];
}

export default function Menu() {
  const { addItem } = useCart();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    foodService
      .getCategories()
      .then((res) => setCategories(extractArray(res?.data, "categories")))
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setCategories([]);
      });
  }, []);

  const loadFoods = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await foodService.getAll({
        page,
        limit: 12,
        category: activeCategory || undefined,
        search: debouncedSearch || undefined,
      });
      const payload = res?.data;
      setFoods(extractArray(payload, "foods"));
      setTotalPages(payload?.totalPages || payload?.data?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load foods:", err);
      setError(getErrorMessage(err));
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, debouncedSearch]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedSearch]);

  const handleAdd = (food) => {
    addItem(food, 1);
    toast.success(`${food.name} added to cart`);
  };

  return (
    <div className="page-shell py-8">
      <h1 className="section-title">Our menu</h1>
      <p className="mt-1 text-ink-600">Freshly prepared dishes, ready to order.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
          <input
            type="text"
            placeholder="Search dishes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="mt-4">
        <CategoryFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadFoods} />
        ) : foods.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No dishes found"
            description="Try a different search term or category."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} onAdd={handleAdd} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}