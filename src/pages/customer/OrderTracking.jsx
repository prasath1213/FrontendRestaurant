import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPhone, FiPackage } from "react-icons/fi";
import { orderService } from "../../services/orderService";
import { useInterval } from "../../hooks/useInterval";
import { socket } from "../../socket";
import OrderTimeline from "../../components/customer/OrderTimeline";
import StatusBadge from "../../components/common/StatusBadge";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, formatDateTime, getErrorMessage } from "../../utils/formatters";
import { ORDER_STATUS } from "../../utils/constants";

const ACTIVE_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveConnected, setLiveConnected] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      const { data } = await orderService.track(id);
      setOrder(data.data?.order || data.order || data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!id) return;

    // socket.js has autoConnect: false, so we must connect explicitly here
    if (!socket.connected) {
      socket.connect();
    }

    // Join this order's tracking room
    socket.emit("trackOrder", id);

    const handleConnect = () => {
      setLiveConnected(true);
      // Re-join room on reconnect (e.g. after network blip)
      socket.emit("trackOrder", id);
    };
    const handleDisconnect = () => setLiveConnected(false);

    const handleStatusUpdate = (data) => {
      if (data.orderId !== id) return;

      // Merge the live update into existing order state instead of
      // waiting for the next poll — instant UI update
      setOrder((prev) =>
        prev
          ? {
            ...prev,
            status: data.status,
            ...(data.deliveryStaffAssigned && {
              deliveryStaffAssignedName: data.deliveryStaffAssigned,
            }),
          }
          : prev
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("orderStatusUpdate", handleStatusUpdate);

    if (socket.connected) setLiveConnected(true);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("orderStatusUpdate", handleStatusUpdate);
    };
  }, [id]);

  const isActive = order && ACTIVE_STATUSES.includes(order.status);

  // Fallback polling: only needed if socket isn't connected,
  // or as a safety net every 30s even when live (in case an event was missed)
  useInterval(loadOrder, isActive ? (liveConnected ? 30000 : 15000) : null);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-shell py-10">
        <ErrorMessage message={error || "Order not found."} onRetry={loadOrder} />
      </div>
    );
  }

  return (
    <div className="page-shell py-8">
      <Link to="/my-orders" className="btn-ghost mb-4 inline-flex gap-2 px-0">
        <FiArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="section-title">Order #{order._id?.slice(-6).toUpperCase()}</h1>
        <div className="flex items-center gap-2">
          {isActive && (
            <span
              className={`flex items-center gap-1.5 text-xs font-medium ${liveConnected ? "text-basil-600" : "text-ink-400"
                }`}
              title={liveConnected ? "Live tracking active" : "Reconnecting..."}
            >
              <span
                className={`h-2 w-2 rounded-full ${liveConnected ? "bg-basil-500 animate-pulse" : "bg-ink-300"
                  }`}
              />
              {liveConnected ? "Live" : "Connecting..."}
            </span>
          )}
          <StatusBadge status={order.status} />
        </div>
      </div>
      <p className="mt-1 text-sm text-ink-600">Placed on {formatDateTime(order.createdAt)}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">Status</h2>
          <div className="mt-4">
            <OrderTimeline status={order.status} />
          </div>

          {order.deliveryStaff && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-basil-100 text-basil-600">
                <FiPackage size={18} />
              </span>
              <div>
                <p className="font-medium text-ink-900">{order.deliveryStaff.name}</p>
                <p className="text-sm text-ink-600">Your delivery partner</p>
              </div>
              {order.deliveryStaff.phone && (
                <a
                  href={`tel:${order.deliveryStaff.phone}`}
                  className="btn-outline ml-auto gap-2 text-sm"
                >
                  <FiPhone size={14} /> Call
                </a>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink-900">Items</h3>
            <div className="mt-3 space-y-2 text-sm">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between text-ink-600">
                  <span>
                    {item.quantity} × {item.food?.name || item.name}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-ink-100 pt-3 font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <FiMapPin size={18} /> Delivery address
            </h3>
            <p className="mt-2 text-sm text-ink-600">
              {order.deliveryAddress?.fullName}
              <br />
              {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}
              <br />
              {order.deliveryAddress?.pincode}
              <br />
              {order.deliveryAddress?.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}