import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import SelectField from "../../components/common/SelectField";
import StatusBadge from "../../components/common/StatusBadge";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, formatDateTime, getErrorMessage } from "../../utils/formatters";
import { ORDER_STATUS } from "../../utils/constants";

// Forward-moving pipeline. Owner/admin can push an order to the next step.
// Cancellation is a separate action, not part of this forward chain.
const STATUS_FLOW = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY_FOR_DELIVERY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.COMPLETED,
];

const getNextStatus = (currentStatus) => {
  const idx = STATUS_FLOW.indexOf(currentStatus);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
};

export default function OrderManagement() {
  const fetchOrders = useCallback(() => orderService.getAllOrders({ limit: 100 }), []);
  const { data, loading, error, refetch } = useFetch(fetchOrders);
  const orders = data?.orders || data || [];

  const [deliveryStaffOptions, setDeliveryStaffOptions] = useState([]);
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [advancingId, setAdvancingId] = useState(null);

  useEffect(() => {
    userService
      .getDeliveryStaff({ limit: 100 })
      .then(({ data }) => setDeliveryStaffOptions(data?.staff || data || []))
      .catch(() => { });
  }, []);

  const openAssignModal = (order) => {
    setAssignModalOrder(order);
    setSelectedStaff(order.deliveryStaff?._id || "");
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      toast.error("Select a delivery staff member.");
      return;
    }
    setAssigning(true);
    try {
      await orderService.assignDeliveryStaff(assignModalOrder._id, selectedStaff);
      toast.success("Delivery staff assigned.");
      setAssignModalOrder(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  const handleAdvanceStatus = async (order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    setAdvancingId(order._id);
    try {
      await orderService.updateStatus(order._id, nextStatus);
      toast.success(`Order moved to ${nextStatus}.`);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAdvancingId(null);
    }
  };

  const columns = [
    {
      key: "id",
      header: "Order",
      render: (row) => (
        <div>
          <p className="font-medium text-ink-900">#{row._id?.slice(-6).toUpperCase()}</p>
          <p className="text-xs text-ink-500">{formatDateTime(row.createdAt)}</p>
        </div>
      ),
    },
    { key: "customer", header: "Customer", render: (row) => row.customer?.name || "—" },
    { key: "total", header: "Total", render: (row) => formatCurrency(row.total) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "delivery",
      header: "Delivery staff",
      render: (row) => row.deliveryStaff?.name || "Unassigned",
    },
    {
      key: "actions",
      header: "",
      render: (row) => {
        const nextStatus = getNextStatus(row.status);
        const isTerminal = row.status === ORDER_STATUS.CANCELLED;
        return (
          <div className="flex justify-end gap-2">
            {nextStatus && !isTerminal && (
              <button
                onClick={() => handleAdvanceStatus(row)}
                disabled={advancingId === row._id}
                className="btn-outline text-xs disabled:opacity-40"
              >
                {advancingId === row._id ? "Updating…" : `Mark as ${nextStatus}`}
              </button>
            )}
            <button
              onClick={() => openAssignModal(row)}
              disabled={row.status === ORDER_STATUS.DELIVERED || row.status === ORDER_STATUS.CANCELLED}
              className="btn-outline text-xs disabled:opacity-40"
            >
              Assign delivery
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-ink-900">Order management</h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={orders} emptyMessage="No orders placed yet." />
      )}

      <FormModal
        open={Boolean(assignModalOrder)}
        title={`Assign delivery — #${assignModalOrder?._id?.slice(-6).toUpperCase() || ""}`}
        onClose={() => setAssignModalOrder(null)}
      >
        <form onSubmit={handleAssign} className="space-y-4">
          <SelectField
            label="Delivery staff member"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            options={[
              { value: "", label: "Select staff member" },
              ...deliveryStaffOptions.map((staff) => ({ value: staff._id, label: staff.name })),
            ]}
          />
          <button type="submit" disabled={assigning} className="btn-primary w-full">
            {assigning ? "Assigning…" : "Assign"}
          </button>
        </form>
      </FormModal>
    </div>
  );
}