import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiChevronRight } from "react-icons/fi";
import { orderService } from "../../services/orderService";
import StatusBadge from "../../components/common/StatusBadge";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency, formatDateTime, getErrorMessage } from "../../utils/formatters";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await orderService.getMyOrders();
      setOrders(data.data?.orders || data.orders || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="page-shell py-8">
      <h1 className="section-title">My orders</h1>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadOrders} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag />}
            title="No orders yet"
            description="Your order history will show up here once you place your first order."
            action={
              <Link to="/menu" className="btn-primary">
                Browse menu
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}/track`}
                className="card flex items-center justify-between gap-4 p-5 transition hover:shadow-lift"
              >
                <div>
                  <p className="font-semibold text-ink-900">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-ink-600">{formatDateTime(order.createdAt)}</p>
                  <p className="mt-1 text-sm text-ink-600">
                    {(order.items || []).length} item(s) · {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <FiChevronRight className="text-ink-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
