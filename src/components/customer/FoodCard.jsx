import { Link } from "react-router-dom";
import { FiPlus, FiStar } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatters";

export default function FoodCard({ food, onAdd }) {
  const isAvailable = food.isAvailable !== false;

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:shadow-lift">
      <Link to={`/menu/${food._id}`} className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        {food.imageUrl ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍽️</div>
        )}
        {!isAvailable && (
          <span className="absolute left-2 top-2 badge bg-ink-900 text-white">Sold out</span>
        )}
        {food.foodType !== undefined && (
          <span
            className={`absolute right-2 top-2 h-4 w-4 rounded-sm border-2 ${
              food.foodType === 'Veg' ? "border-basil-500" : "border-chili-500"
            } bg-white p-0.5`}
          >
            <span className={`block h-full w-full rounded-full ${food.foodType === 'Veg' ? "bg-basil-500" : "bg-chili-500"}`} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/menu/${food._id}`}>
          <h3 className="font-display text-base font-semibold text-ink-900 hover:text-chili-600">
            {food.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ink-600">{food.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-ink-900">
            {formatCurrency(food.price)}
          </span>
          {food.rating > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-turmeric-600">
              <FiStar size={14} className="fill-turmeric-500" /> {food.rating.toFixed(1)}
            </span>
          )}
        </div>

        <button
          onClick={() => onAdd(food)}
          disabled={!isAvailable}
          className="btn-primary mt-3 w-full gap-2 text-sm"
        >
          <FiPlus size={16} /> Add to cart
        </button>
      </div>
    </div>
  );
}
