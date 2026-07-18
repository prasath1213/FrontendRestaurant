import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiClock } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../services/orderService";
import StaffOrderCard from "../../components/staff/StaffOrderCard";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { ORDER_STATUS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/formatters";

export default function PreparingOrders() {
  const fetchPreparing = useCallback(() => orderService.getPreparingOrders(), []);
  const { data, loading, error, refetch, setData } = useFetch(fetchPreparing);
  const orders = data?.orders || data || [];
  const [updatingId, setUpdatingId] = useState(null);

  const handleMarkReady = async (order) => {
    setUpdatingId(order._id);
    try {
      await orderService.updateStatus(order._id, ORDER_STATUS.READY);
      toast.success(`Order #${order._id.slice(-6).toUpperCase()} marked ready.`);
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
        <h2 className="font-display text-xl font-semibold text-ink-900">Preparing orders</h2>
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
          icon={<FiClock />}
          title="Nothing in the kitchen"
          description="Orders being prepared will show up here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <StaffOrderCard
              key={order._id}
              order={order}
              actionLabel="Mark ready"
              onAction={handleMarkReady}
              actionLoading={updatingId === order._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
