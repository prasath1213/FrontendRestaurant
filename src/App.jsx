import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomerLayout from "./layouts/CustomerLayout";
import StaffLayout from "./layouts/StaffLayout";
import DeliveryLayout from "./layouts/DeliveryLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { ROLES } from "./utils/constants";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/admin/AdminLogin";

import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import FoodDetails from "./pages/customer/FoodDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Payment from "./pages/customer/Payment";
import OrderTracking from "./pages/customer/OrderTracking";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./pages/customer/Profile";

import StaffDashboard from "./pages/staff/StaffDashboard";
import NewOrders from "./pages/staff/NewOrders";
import PreparingOrders from "./pages/staff/PreparingOrders";

import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import AssignedOrders from "./pages/delivery/AssignedOrders";
import DeliveryStatus from "./pages/delivery/DeliveryStatus";

import AdminDashboard from "./pages/admin/AdminDashboard";
import FoodManagement from "./pages/admin/FoodManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import DeliveryStaffManagement from "./pages/admin/DeliveryStaffManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import Reports from "./pages/admin/Reports";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public-only auth routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* Customer-facing routes (browsable by anyone, role-gated where needed) */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<FoodDetails />} />

          <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/orders/:id/track" element={<OrderTracking />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Staff routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STAFF]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="new-orders" element={<NewOrders />} />
            <Route path="preparing-orders" element={<PreparingOrders />} />
          </Route>
        </Route>

        {/* Delivery routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.DELIVERY]} />}>
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="assigned-orders" element={<AssignedOrders />} />
            <Route path="status" element={<DeliveryStatus />} />
          </Route>
        </Route>

        {/* Admin / Owner routes */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="foods" element={<FoodManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="delivery-staff" element={<DeliveryStaffManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </>
  );
}