export const ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  DELIVERY: "deliveryStaff",
  ADMIN: "owner",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.CONFIRMED]: "Confirmed",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.READY]: "Ready for pickup",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "Out for delivery",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const TOKEN_KEY = "rfo_token";
export const USER_KEY = "rfo_user";

export const DASHBOARD_PATH = {
  [ROLES.CUSTOMER]: "/",
  [ROLES.STAFF]: "/staff/dashboard",
  [ROLES.DELIVERY]: "/delivery/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};