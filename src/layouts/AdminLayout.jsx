import { FiGrid, FiCoffee, FiShoppingBag, FiUsers, FiTruck, FiUser, FiBarChart2 } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/foods", label: "Food management", icon: FiCoffee },
  { to: "/admin/orders", label: "Order management", icon: FiShoppingBag },
  { to: "/admin/staff", label: "Staff management", icon: FiUsers },
  { to: "/admin/delivery-staff", label: "Delivery staff", icon: FiTruck },
  { to: "/admin/customers", label: "Customers", icon: FiUser },
  { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
];

export default function AdminLayout() {
  return <DashboardLayout title="Admin Panel" sidebarTitle="Owner / Admin" navItems={navItems} />;
}
