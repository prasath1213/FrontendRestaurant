import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPackage } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../services/orderService";
import DeliveryOrderCard from "../../components/delivery/DeliveryOrderCard";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { ORDER_STATUS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/formatters";

export default function AssignedOrders() {
  const fetchAssigned = useCallback(() => orderService.getAssignedOrders(), []);
  const { data, loading, error, refetch, setData } = useFetch(fetchAssigned);
  const orders = (data?.orders || data || []).filter(
    (order) => order.status === ORDER_STATUS.READY
  );
  const [updatingId, setUpdatingId] = useState(null);

  const handlePickup = async (order) => {
    setUpdatingId(order._id);
    try {
      await orderService.updateDeliveryStatus(order._id, ORDER_STATUS.OUT_FOR_DELIVERY);
      toast.success(`Order #${order._id.slice(-6).toUpperCase()} is out for delivery.`);
      setData((prev) => {
        const list = prev?.orders || prev || [];
        return {
          ...(prev?.orders ? prev : {}),
          orders: list.map((o) =>
            o._id === order._id ? { ...o, status: ORDER_STATUS.OUT_FOR_DELIVERY } : o
          ),
        };
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
        <h2 className="font-display text-xl font-semibold text-ink-900">Assigned orders</h2>
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
          icon={<FiPackage />}
          title="No orders assigned"
          description="Orders ready for pickup will show up here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <DeliveryOrderCard
              key={order._id}
              order={order}
              actionLabel="Pick up & start delivery"
              onAction={handlePickup}
              actionLoading={updatingId === order._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
