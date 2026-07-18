import { useCallback } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiNavigation, FiCheckCircle } from "react-icons/fi";
import { useFetch } from "../../hooks/useFetch";
import { dashboardService } from "../../services/dashboardService";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function DeliveryDashboard() {
  const fetchStats = useCallback(() => dashboardService.getDeliveryStats(), []);
  const { data, loading, error, refetch } = useFetch(fetchStats);
  const stats = data?.stats || data || {};

  return (
    <div>
      <p className="text-sm text-ink-600">Your delivery activity for today.</p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} className="mt-6" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<FiPackage size={20} />}
            label="Assigned orders"
            value={stats.assignedOrders ?? 0}
            accent="bg-chili-50 text-chili-600"
          />
          <StatCard
            icon={<FiNavigation size={20} />}
            label="Out for delivery"
            value={stats.outForDelivery ?? 0}
            accent="bg-turmeric-100 text-turmeric-600"
          />
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Delivered today"
            value={stats.deliveredToday ?? 0}
            accent="bg-basil-100 text-basil-600"
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/delivery/assigned-orders"
          className="card flex items-center justify-between p-6 hover:shadow-lift"
        >
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">Assigned orders</p>
            <p className="text-sm text-ink-600">Orders ready for you to pick up.</p>
          </div>
          <FiPackage className="text-chili-500" size={24} />
        </Link>
        <Link to="/delivery/status" className="card flex items-center justify-between p-6 hover:shadow-lift">
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">Delivery status</p>
            <p className="text-sm text-ink-600">Update orders as out for delivery or delivered.</p>
          </div>
          <FiNavigation className="text-turmeric-500" size={24} />
        </Link>
      </div>
    </div>
  );
}
