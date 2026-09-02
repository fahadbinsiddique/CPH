import api from '@/lib/api';

export const consultantService = {
  // Public & Consultant Routes
  getAll: (params = {}) => api.get('/api/consultants/', { params }),
  getBySlug: (slug) => api.get(`/api/consultants/${slug}/`),
  getSpecializations: () => api.get('/api/consultants/specializations/'),

  create: (data) =>
    api.post('/api/consultants/create/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Authenticated "become a consultant" flow (upsert on the current user).
  meGet: () => api.get('/api/consultants/me/'),
  meCreate: (data) =>
    api.post('/api/consultants/me/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Availability Routes
  getAvailability: () => api.get('/api/consultants/availability/'),
  getAvailabilityForDate: (slug, date) =>
    api.get(`/api/consultants/${slug}/availability/`, { params: { date } }),
  deleteAvailability: (id) => api.delete(`/api/consultants/availability/${id}/`),

  // Admin — Consultant Management
  adminGetAll: () => api.get('/api/admin/consultants/'),
  adminGetOne: (id) => api.get(`/api/admin/consultants/${id}/`),
  adminCreate: (data, config = {}) =>
    api.post('/api/admin/consultants/create/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),
  adminUpdate: (id, data, config = {}) =>
    api.patch(`/api/admin/consultants/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),
  adminDelete: (id) => api.delete(`/api/admin/consultants/${id}/`),
  adminVerify: (id, value) =>
    api.patch(`/api/admin/consultants/${id}/verify/`, { is_verified: value }),

  // Admin — Specialization Management
  adminGetSpecializations: () => api.get('/api/admin/consultants/specializations/'),
  adminCreateSpecialization: (data) => api.post('/api/admin/consultants/specializations/', data),
  adminUpdateSpecialization: (id, data) =>
    api.patch(`/api/admin/consultants/specializations/${id}/`, data),
  adminDeleteSpecialization: (id) => api.delete(`/api/admin/consultants/specializations/${id}/`),
}
