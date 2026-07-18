import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatters";

export default function CartItemRow({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="flex items-center gap-4 border-b border-ink-100 py-4 last:border-0">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium text-ink-900">{item.name}</p>
        <p className="text-sm text-ink-600">{formatCurrency(item.price)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrement(item._id)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-700 hover:border-chili-500"
          aria-label="Decrease quantity"
        >
          <FiMinus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => onIncrement(item._id)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-700 hover:border-chili-500"
          aria-label="Increase quantity"
        >
          <FiPlus size={14} />
        </button>
      </div>

      <span className="w-20 shrink-0 text-right font-semibold text-ink-900">
        {formatCurrency(item.price * item.quantity)}
      </span>

      <button
        onClick={() => onRemove(item._id)}
        className="text-ink-400 hover:text-chili-600"
        aria-label="Remove item"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}
