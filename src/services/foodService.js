import api from "./api";

export const foodService = {
  getAll: (params) => api.get("/foods", { params }),
  getById: (id) => api.get(`/foods/${id}`),
  getCategories: () => api.get("/foods/categories"),
  create: (data) => api.post("/foods", data),
  update: (id, data) => api.patch(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`),
};