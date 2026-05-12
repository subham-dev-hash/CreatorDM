import api from './client';

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getTimeline: (params) => api.get('/analytics/timeline', { params }), // supports days query
  getTopLeads: () => api.get('/analytics/top-leads'),
};
