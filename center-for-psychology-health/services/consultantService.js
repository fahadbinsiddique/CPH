import api from '@/lib/api';

export const consultantService = {
  getAll: (params = {}) =>
    api.get('/api/consultants/', { params }),

  getBySlug: (slug) =>
    api.get(`/api/consultants/${slug}/`),

  getSpecializations: () =>
    api.get('/api/consultants/specializations/'),
};