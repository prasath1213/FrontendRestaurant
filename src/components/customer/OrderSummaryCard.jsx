import { formatCurrency } from "../../utils/formatters";

export default function OrderSummaryCard({ subtotal, deliveryFee, total, itemCount, children }) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-semibold text-ink-900">Order summary</h3>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-ink-600">
          <span>Items ({itemCount})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-600">
          <span>Delivery fee</span>
          <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : "Free"}</span>
        </div>
        <div className="flex justify-between border-t border-ink-100 pt-2 font-display text-base font-semibold text-ink-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {children}
    </div>
  );
}
