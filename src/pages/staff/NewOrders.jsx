import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiBell } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../services/orderService";
import StaffOrderCard from "../../components/staff/StaffOrderCard";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { ORDER_STATUS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/formatters";

export default function NewOrders() {
  const fetchNewOrders = useCallback(() => orderService.getNewOrders(), []);
  const { data, loading, error, refetch, setData } = useFetch(fetchNewOrders);
  const orders = data?.orders || data || [];
  const [updatingId, setUpdatingId] = useState(null);

  const handleConfirm = async (order) => {
    setUpdatingId(order._id);
    try {
      await orderService.updateStatus(order._id, ORDER_STATUS.PREPARING);
      toast.success(`Order #${order._id.slice(-6).toUpperCase()} moved to preparing.`);
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
        <h2 className="font-display text-xl font-semibold text-ink-900">New orders</h2>
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
        <EmptyState icon={<FiBell />} title="No new orders" description="New orders will appear here as customers place them." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <StaffOrderCard
              key={order._id}
              order={order}
              actionLabel="Start preparing"
              onAction={handleConfirm}
              actionLoading={updatingId === order._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
