import api from './client';

export const leadsApi = {
  getAll: (params) => api.get('/leads', { params }), // supports page, limit, status, search
  getById: (id) => api.get(`/leads/${id}`),
  update: (id, data) => api.put(`/leads/${id}`, data),
};
