import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft, FiPlus, FiMinus, FiStar } from "react-icons/fi";
import { foodService } from "../../services/foodService";
import { useCart } from "../../context/CartContext";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, getErrorMessage } from "../../utils/formatters";

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    foodService
      .getById(id)
      .then(({ data }) => {
        if (active) setFood(data?.food || data);
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    addItem(food, quantity);
    toast.success(`${quantity} × ${food.name} added to cart`);
  };

  const handleOrderNow = () => {
    addItem(food, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="page-shell py-10">
        <ErrorMessage message={error || "Dish not found."} />
        <Link to="/menu" className="btn-outline mt-4 inline-flex gap-2">
          <FiArrowLeft size={16} /> Back to menu
        </Link>
      </div>
    );
  }

  const isAvailable = food.isAvailable !== false;

  return (
    <div className="page-shell py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 gap-2 px-0">
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl2 bg-ink-100">
          {food.imageUrl ? (
            <img src={food.imageUrl} alt={food.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🍽️</div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-bold text-ink-900">{food.name}</h1>
            {food.rating > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-turmeric-100 px-3 py-1 text-sm font-semibold text-turmeric-600">
                <FiStar size={14} /> {food.rating.toFixed(1)}
              </span>
            )}
          </div>

          {food.category && (
            <span className="mt-2 inline-block badge bg-ink-100 text-ink-600 capitalize">
              {food.category}
            </span>
          )}

          <p className="mt-4 text-ink-600">{food.description}</p>

          <p className="mt-6 font-display text-3xl font-bold text-ink-900">
            {formatCurrency(food.price)}
          </p>

          {!isAvailable && (
            <p className="mt-3 font-medium text-chili-600">This item is currently sold out.</p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-ink-200 px-3 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-ink-700"
                aria-label="Decrease quantity"
              >
                <FiMinus size={16} />
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="text-ink-700"
                aria-label="Increase quantity"
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAddToCart} disabled={!isAvailable} className="btn-outline flex-1">
              Add to cart
            </button>
            <button onClick={handleOrderNow} disabled={!isAvailable} className="btn-primary flex-1">
              Order now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
