import { FiMapPin, FiPhone } from "react-icons/fi";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatters";

export default function DeliveryOrderCard({ order, actionLabel, onAction, actionLoading }) {
  const address = order.deliveryAddress || {};

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-ink-900">#{order._id?.slice(-6).toUpperCase()}</p>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-3 flex items-start gap-2 text-sm text-ink-600">
        <FiMapPin size={16} className="mt-0.5 shrink-0" />
        <span>
          {address.addressLine}, {address.city} {address.pincode}
        </span>
      </div>

      {address.phone && (
        <div className="mt-2 flex items-center gap-2 text-sm text-ink-600">
          <FiPhone size={16} />
          <a href={`tel:${address.phone}`} className="hover:text-chili-600">
            {address.phone}
          </a>
        </div>
      )}

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
