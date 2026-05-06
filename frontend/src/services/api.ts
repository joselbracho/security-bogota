import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const cameraService = {
  list: (params?: any) => api.get('/cameras/', { params }),
  get: (id: string) => api.get(`/cameras/${id}/`),
  create: (data: any) => api.post('/cameras/', data),
  update: (id: string, data: any) => api.patch(`/cameras/${id}/`, data),
  delete: (id: string) => api.delete(`/cameras/${id}/`),
};

export const ticketService = {
  list: (params?: any) => api.get('/tickets/', { params }),
  create: (data: any) => api.post('/tickets/', data),
  update: (id: string, data: any) => api.patch(`/tickets/${id}/`, data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats/'),
};

export default api;
