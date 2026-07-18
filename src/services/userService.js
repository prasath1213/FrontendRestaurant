import api from "./api";

export const userService = {
  // Admin - staff management
  getStaff: (params) => api.get("/users/staff", { params }),
  createStaff: (data) => api.post("/users/staff", data),
  updateStaff: (id, data) => api.put(`/users/staff/${id}`, data),
  removeStaff: (id) => api.delete(`/users/staff/${id}`),

  // Admin - delivery staff management
  getDeliveryStaff: (params) => api.get("/users/delivery-staff", { params }),
  createDeliveryStaff: (data) => api.post("/users/delivery-staff", data),
  updateDeliveryStaff: (id, data) => api.put(`/users/delivery-staff/${id}`, data),
  removeDeliveryStaff: (id) => api.delete(`/users/delivery-staff/${id}`),
  toggleDeliveryAvailability: (id) => api.patch(`/users/delivery-staff/${id}/availability`),

  // Admin - customer management
  getCustomers: (params) => api.get("/users/customers", { params }),
  getCustomerById: (id) => api.get(`/users/customers/${id}`),
  toggleCustomerStatus: (id) => api.patch(`/users/customers/${id}/status`),
};
