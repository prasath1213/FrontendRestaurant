import api from "./api";

export const dashboardService = {
  getAdminStats: () => api.get("/dashboard/admin"),
  getStaffStats: () => api.get("/dashboard/staff"),
  getDeliveryStats: () => api.get("/dashboard/delivery"),
  getReports: (params) => api.get("/dashboard/reports", { params }),
  getSalesReport: (params) => api.get("/dashboard/reports/sales", { params }),
};
