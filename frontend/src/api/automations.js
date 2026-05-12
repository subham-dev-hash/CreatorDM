import api from './client';

export const automationsApi = {
  getAll: () => api.get('/automations'),
  getById: (id) => api.get(`/automations/${id}`),
  create: (data) => api.post('/automations', data),
  update: (id, data) => api.put(`/automations/${id}`, data),
  delete: (id) => api.delete(`/automations/${id}`),
  toggleStatus: (id, isActive) => api.patch(`/automations/${id}/status`, { isActive }),
};
