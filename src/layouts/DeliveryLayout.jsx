import { FiGrid, FiPackage, FiNavigation } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

const navItems = [
  { to: "/delivery/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/delivery/assigned-orders", label: "Assigned orders", icon: FiPackage },
  { to: "/delivery/status", label: "Delivery status", icon: FiNavigation },
];

export default function DeliveryLayout() {
  return <DashboardLayout title="Delivery Panel" sidebarTitle="Delivery" navItems={navItems} />;
}
