import { useCallback } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiClock, FiCheckCircle } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { dashboardService } from "../../services/dashboardService";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function StaffDashboard() {
  const fetchStats = useCallback(() => dashboardService.getStaffStats(), []);
  const { data, loading, error, refetch } = useFetch(fetchStats);
  const stats = data?.stats || data || {};

  return (
    <div>
      <p className="text-sm text-ink-600">Overview of kitchen activity for today.</p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} className="mt-6" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<FiBell size={20} />}
            label="New orders"
            value={stats.newOrders ?? 0}
            accent="bg-chili-50 text-chili-600"
          />
          <StatCard
            icon={<FiClock size={20} />}
            label="Preparing"
            value={stats.preparingOrders ?? 0}
            accent="bg-turmeric-100 text-turmeric-600"
          />
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Completed today"
            value={stats.completedToday ?? 0}
            accent="bg-basil-100 text-basil-600"
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/staff/new-orders" className="card flex items-center justify-between p-6 hover:shadow-lift">
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">New orders</p>
            <p className="text-sm text-ink-600">Review and confirm incoming orders.</p>
          </div>
          <FiBell className="text-chili-500" size={24} />
        </Link>
        <Link
          to="/staff/preparing-orders"
          className="card flex items-center justify-between p-6 hover:shadow-lift"
        >
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">Preparing orders</p>
            <p className="text-sm text-ink-600">Mark orders ready once prepared.</p>
          </div>
          <FiClock className="text-turmeric-500" size={24} />
        </Link>
      </div>
    </div>
  );
}
