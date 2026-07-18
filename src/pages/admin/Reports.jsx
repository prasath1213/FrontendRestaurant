import { useState, useCallback, useEffect } from "react";
import { FiDollarSign, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import { dashboardService } from "../../services/dashboardService";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/admin/DataTable";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, formatDate, getErrorMessage } from "../../utils/formatters";

function getDefaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
}

export default function Reports() {
  const [range, setRange] = useState(getDefaultRange());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await dashboardService.getSalesReport(range);
      setReport(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const summary = report?.summary || {};
  const dailyBreakdown = report?.dailyBreakdown || [];

  const columns = [
    { key: "date", header: "Date", render: (row) => formatDate(row.date) },
    { key: "orders", header: "Orders" },
    { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-ink-900">Reports</h2>
        <div className="flex items-end gap-3">
          <div>
            <label className="label-text">From</label>
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">To</label>
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadReport} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<FiShoppingBag size={20} />}
              label="Total orders"
              value={summary.totalOrders ?? 0}
              accent="bg-chili-50 text-chili-600"
            />
            <StatCard
              icon={<FiDollarSign size={20} />}
              label="Total revenue"
              value={formatCurrency(summary.totalRevenue ?? 0)}
              accent="bg-basil-100 text-basil-600"
            />
            <StatCard
              icon={<FiTrendingUp size={20} />}
              label="Avg. order value"
              value={formatCurrency(summary.avgOrderValue ?? 0)}
              accent="bg-turmeric-100 text-turmeric-600"
            />
          </div>

          <div className="mt-8">
            <h3 className="mb-3 font-display text-lg font-semibold text-ink-900">Daily breakdown</h3>
            <DataTable columns={columns} rows={dailyBreakdown} rowKey="date" emptyMessage="No data for this range." />
          </div>
        </>
      )}
    </div>
  );
}
