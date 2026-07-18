import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import { userService } from "../../services/userService";
import DataTable from "../../components/admin/DataTable";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatDate, getErrorMessage } from "../../utils/formatters";

export default function CustomerManagement() {
  const fetchCustomers = useCallback(() => userService.getCustomers({ limit: 100 }), []);
  const { data, loading, error, refetch } = useFetch(fetchCustomers);
  const customers = data?.customers || data || [];
  const [togglingId, setTogglingId] = useState(null);

  const handleToggleStatus = async (customer) => {
    setTogglingId(customer._id);
    try {
      await userService.toggleCustomerStatus(customer._id);
      toast.success(`${customer.name}'s account ${customer.isActive ? "blocked" : "unblocked"}.`);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    { key: "name", header: "Name", render: (row) => <span className="font-medium text-ink-900">{row.name}</span> },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "orderCount", header: "Orders", render: (row) => row.orderCount ?? 0 },
    { key: "joined", header: "Joined", render: (row) => formatDate(row.createdAt) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          disabled={togglingId === row._id}
          className={`badge ${row.isActive !== false ? "bg-basil-100 text-basil-600" : "bg-chili-100 text-chili-600"}`}
        >
          {row.isActive !== false ? "Active" : "Blocked"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-ink-900">Customer management</h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={customers} emptyMessage="No customers registered yet." />
      )}
    </div>
  );
}
