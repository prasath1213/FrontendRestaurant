# TiffinBox — Restaurant Food Ordering & Home Delivery (Frontend)

A complete, production-ready React + Tailwind CSS frontend for a multi-role
restaurant ordering and delivery platform — built with Vite, React Router,
Axios, and the Context API.

## Roles

- **Customer** — browse menu, order, pay, track delivery
- **Staff** — confirm new orders, manage kitchen preparation
- **Delivery Staff** — view assigned orders, update delivery status
- **Owner / Admin** — manage food, orders, staff, delivery staff, customers, and reports

## Tech stack

- React 19 + Vite
- React Router DOM v7 (protected, role-based routing)
- Axios (with auth interceptors)
- Tailwind CSS v3 (custom design tokens)
- Context API (`AuthContext`, `CartContext`)
- react-toastify (notifications)
- react-icons
- Razorpay Checkout (test/live mode via `.env`)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Environment variables

| Variable               | Description                                                      |
|-------------------------|--------------------------------------------------------------------|
| `VITE_API_BASE_URL`     | Base URL of your backend API (e.g. `http://localhost:5000/api`)   |
| `VITE_RAZORPAY_KEY_ID`  | Razorpay **public** Key ID (test or live)                        |

> Never put your Razorpay **key secret** in the frontend. The secret stays on
> your backend, used only when creating orders / verifying signatures.

## Folder structure

```
src/
 ├── components/     # Reusable UI components, grouped by domain
 │    ├── common/    # Spinner, ErrorMessage, EmptyState, Pagination, etc.
 │    ├── layout/    # Navbar, Footer, DashboardSidebar, DashboardTopbar
 │    ├── customer/  # FoodCard, CartItemRow, OrderSummaryCard, OrderTimeline...
 │    ├── staff/     # StaffOrderCard
 │    ├── delivery/  # DeliveryOrderCard
 │    └── admin/     # DataTable, FormModal
 ├── pages/          # Route-level pages, grouped by role
 │    ├── auth/      # Login, Register
 │    ├── customer/  # Home, Menu, FoodDetails, Cart, Checkout, Payment, ...
 │    ├── staff/     # StaffDashboard, NewOrders, PreparingOrders
 │    ├── delivery/  # DeliveryDashboard, AssignedOrders, DeliveryStatus
 │    └── admin/     # AdminDashboard, FoodManagement, OrderManagement, ...
 ├── layouts/        # CustomerLayout, StaffLayout, DeliveryLayout, AdminLayout
 ├── routes/         # ProtectedRoute, PublicOnlyRoute
 ├── context/        # AuthContext (JWT), CartContext (cart state)
 ├── services/       # Axios service modules per resource
 ├── hooks/          # useFetch, useDebounce, useInterval
 ├── utils/          # constants, formatters, validators
 └── assets/
```

## Expected backend API contract

The frontend assumes a standard REST API under `VITE_API_BASE_URL`. Update
`src/services/*.js` if your backend's routes differ.

### Auth (`/auth`)
- `POST /auth/register` — `{ name, email, phone, password, role }` → `{ token, user }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET /auth/me` — current user profile
- `PUT /auth/me` — update profile
- `PUT /auth/change-password` — `{ currentPassword, newPassword }`
- `POST /auth/logout`

All authenticated requests send `Authorization: Bearer <token>`.

### Foods (`/foods`)
- `GET /foods` — query: `page, limit, category, search, sort`
- `GET /foods/categories`
- `GET /foods/:id`
- `POST /foods` (admin)
- `PUT /foods/:id` (admin)
- `DELETE /foods/:id` (admin)
- `PATCH /foods/:id/availability` (admin)

### Orders (`/orders`)
- `POST /orders` — create order (customer)
- `GET /orders/my-orders` — customer's own orders
- `GET /orders/:id`, `GET /orders/:id/track`
- `PATCH /orders/:id/cancel`
- `GET /orders/staff/new`, `GET /orders/staff/preparing`
- `PATCH /orders/:id/status` — `{ status }` (staff)
- `GET /orders/delivery/assigned`
- `PATCH /orders/:id/delivery-status` — `{ status }` (delivery staff)
- `GET /orders` — all orders (admin)
- `PATCH /orders/:id/assign-delivery` — `{ deliveryStaffId }` (admin)

### Payments (`/payments`)
- `POST /payments/razorpay/create-order` — `{ orderId }` → Razorpay order object
- `POST /payments/razorpay/verify` — `{ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- `GET /payments/:orderId/status`

### Users (`/users`) — admin only
- `GET/POST /users/staff`, `PUT/DELETE /users/staff/:id`
- `GET/POST /users/delivery-staff`, `PUT/DELETE /users/delivery-staff/:id`, `PATCH /users/delivery-staff/:id/availability`
- `GET /users/customers`, `GET /users/customers/:id`, `PATCH /users/customers/:id/status`

### Dashboard (`/dashboard`)
- `GET /dashboard/admin`, `GET /dashboard/staff`, `GET /dashboard/delivery`
- `GET /dashboard/reports/sales` — query: `from, to`

## Notes

- Order statuses follow this flow: `pending → confirmed → preparing → ready → out_for_delivery → delivered` (or `cancelled` at any point before delivery).
- The cart persists to `localStorage`; the auth session persists the JWT and user object to `localStorage` and re-validates against `/auth/me` on load.
- Order tracking polls `/orders/:id/track` every 15 seconds while the order is active.
