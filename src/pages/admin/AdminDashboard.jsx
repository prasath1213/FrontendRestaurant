import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { dashboardService } from "../../services/dashboardService";
import { foodService } from "../../services/foodService";

const CATEGORIES = [
  "Starters", "Main Course", "Breads", "Rice & Biryani",
  "Desserts", "Beverages", "Salads", "Soups", "Fast Food", "Combos",
];

const StatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-2xl p-6 text-white ${color} shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
      </div>
      <span className="text-4xl opacity-70">{icon}</span>
    </div>
  </div>
);

const EMPTY_FOOD = {
  name: "", description: "", price: "", category: "",
  imageUrl: "", foodType: "Non Veg", preparationTimeMinutes: 20, isAvailable: true,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [foodForm, setFoodForm] = useState(EMPTY_FOOD);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dashboardService.getAdminStats()
      .then((res) => {
        const payload = res?.data?.data || res?.data;
        setStats(payload?.stats || {});
        setRecentOrders(payload?.recentOrders || []);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setFoodForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price || !foodForm.category) {
      toast.error("Name, price and category are required.");
      return;
    }
    setSaving(true);
    try {
      await foodService.create({
        name: foodForm.name,
        description: foodForm.description,
        price: parseFloat(foodForm.price),
        category: foodForm.category,
        imageUrl: foodForm.imageUrl,
        foodType: foodForm.foodType,
        preparationTimeMinutes: parseInt(foodForm.preparationTimeMinutes, 10),
        isAvailable: foodForm.isAvailable === true || foodForm.isAvailable === "true",
      });
      toast.success(`${foodForm.name} added to menu!`);
      setFoodForm(EMPTY_FOOD);
      setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add food item.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard…</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          {showForm ? "Cancel" : "+ Add Food"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon="📦" color="bg-blue-500" />
        <StatCard title="Today's Orders" value={stats?.todayOrders ?? 0} icon="🕐" color="bg-orange-500" />
        <StatCard title="Total Customers" value={stats?.totalCustomers ?? 0} icon="👥" color="bg-green-500" />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          icon="💰"
          color="bg-purple-500"
        />
      </div>

      {/* Add Food Form */}
      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Add New Food Item</h2>
          <form onSubmit={handleAddFood} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
              <input name="name" value={foodForm.name} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="e.g. Butter Chicken" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
              <select name="category" value={foodForm.category} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400">
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input name="price" type="number" value={foodForm.price} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="e.g. 250" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Prep Time (mins)</label>
              <input name="preparationTimeMinutes" type="number" value={foodForm.preparationTimeMinutes}
                onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Food Type *</label>
              <select name="foodType" value={foodForm.foodType} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400">
                <option value="Non Veg">🍖 Non Veg</option>
                <option value="Veg">🥦 Veg</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Availability</label>
              <select name="isAvailable" value={foodForm.isAvailable} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400">
                <option value={true}>✅ Available</option>
                <option value={false}>❌ Not Available</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <input name="description" value={foodForm.description} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="Short description" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
              <input name="imageUrl" value={foodForm.imageUrl} onChange={handleFoodChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="https://..." />
            </div>

            <div className="flex justify-end sm:col-span-2">
              <button type="submit" disabled={saving}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {saving ? "Saving…" : "Add to Menu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Order #</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{order.orderNumber || order._id?.slice(-6)}</td>
                    <td className="px-6 py-3 text-gray-600">{order.customer?.name || "—"}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-800">₹{order.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}