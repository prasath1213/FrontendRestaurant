import api from "./api";
import { ORDER_STATUS } from "../utils/constants";

// Backend has no generic PATCH /orders/:id/status route — each status
// transition has its own dedicated endpoint. Map target status -> route.
const STATUS_ROUTE_MAP = {
  [ORDER_STATUS.ACCEPTED]: "accept",
  [ORDER_STATUS.PREPARING]: "preparing",
  [ORDER_STATUS.READY_FOR_DELIVERY]: "ready",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "pickup",
  [ORDER_STATUS.DELIVERED]: "delivered",
  [ORDER_STATUS.COMPLETED]: "complete",
};

export const orderService = {
  create: (data) => api.post("/orders", data),
  getMyOrders: (params) => api.get("/orders/my-orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
  track: (id) => api.get(`/orders/${id}`),

  // Staff
  getNewOrders: () => api.get("/orders/staff/new"),
  getPreparingOrders: () => api.get("/orders/staff/preparing"),

  // Advances an order to the given target status by hitting the correct
  // dedicated backend route (accept / preparing / ready / pickup / delivered / complete)
  updateStatus: (id, status) => {
    const route = STATUS_ROUTE_MAP[status];
    if (!route) {
      return Promise.reject(new Error(`No backend route mapped for status "${status}".`));
    }
    return api.patch(`/orders/${id}/${route}`);
  },

  // Delivery
  getAssignedOrders: () => api.get("/orders/delivery/assigned"),
  updateDeliveryStatus: (id, status) => api.patch(`/orders/${id}/delivery-status`, { status }),

  // Admin
  getAllOrders: (params) => api.get("/orders", { params }),
  assignDeliveryStaff: (id, deliveryStaffId) =>
    api.patch(`/orders/${id}/assign-delivery`, { deliveryStaffId }),
};