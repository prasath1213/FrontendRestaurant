import { FiGrid, FiBell, FiClock } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

const navItems = [
  { to: "/staff/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/staff/new-orders", label: "New orders", icon: FiBell },
  { to: "/staff/preparing-orders", label: "Preparing", icon: FiClock },
];

export default function StaffLayout() {
  return <DashboardLayout title="Staff Panel" sidebarTitle="Staff" navItems={navItems} />;
}
