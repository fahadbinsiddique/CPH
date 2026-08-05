import api from '@/lib/api';

export const assessmentService = {
  getAll: () => api.get('/api/assessments/'),
  getBySlug: (slug) => api.get(`/api/assessments/${slug}/`),
  submit: (data) => api.post('/api/assessments/submit/', data),
  getResults: () => api.get('/api/assessments/results/'),
  getResultById: (id) => api.get(`/api/assessments/results/${id}/`),
};