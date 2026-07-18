import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiNavigation } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../services/orderService";
import DeliveryOrderCard from "../../components/delivery/DeliveryOrderCard";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { ORDER_STATUS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/formatters";

export default function DeliveryStatus() {
  const fetchAssigned = useCallback(() => orderService.getAssignedOrders(), []);
  const { data, loading, error, refetch, setData } = useFetch(fetchAssigned);
  const orders = (data?.orders || data || []).filter(
    (order) => order.status === ORDER_STATUS.OUT_FOR_DELIVERY
  );
  const [updatingId, setUpdatingId] = useState(null);

  const handleDelivered = async (order) => {
    setUpdatingId(order._id);
    try {
      await orderService.updateDeliveryStatus(order._id, ORDER_STATUS.DELIVERED);
      toast.success(`Order #${order._id.slice(-6).toUpperCase()} marked delivered.`);
      setData((prev) => {
        const list = prev?.orders || prev || [];
        return { ...(prev?.orders ? prev : {}), orders: list.filter((o) => o._id !== order._id) };
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-900">Out for delivery</h2>
        <button onClick={refetch} className="btn-outline text-sm">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<FiNavigation />}
          title="Nothing on the road"
          description="Orders you're currently delivering will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <DeliveryOrderCard
              key={order._id}
              order={order}
              actionLabel="Mark delivered"
              onAction={handleDelivered}
              actionLoading={updatingId === order._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
