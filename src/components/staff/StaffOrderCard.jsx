import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export default function StaffOrderCard({ order, actionLabel, onAction, actionLoading }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-ink-900">#{order._id?.slice(-6).toUpperCase()}</p>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-xs text-ink-500">{formatDateTime(order.createdAt)}</p>

      <div className="mt-3 space-y-1 text-sm text-ink-600">
        {(order.items || []).map((item, idx) => (
          <p key={idx}>
            {item.quantity} × {item.food?.name || item.name}
          </p>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
        <span className="font-semibold text-ink-900">{formatCurrency(order.total)}</span>
        {actionLabel && (
          <button onClick={() => onAction(order)} disabled={actionLoading} className="btn-primary text-sm">
            {actionLoading ? "Updating…" : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
