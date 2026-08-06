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

  // Availability Routes
  getAvailability: () => api.get('/api/consultants/availability/'),
  deleteAvailability: (id) => api.delete(`/api/consultants/availability/${id}/`),

  // Admin — Consultant Management
  adminGetAll: () => api.get('/api/consultants/admin/list/'),
  adminGetOne: (id) => api.get(`/api/consultants/admin/${id}/`),
  adminCreate: (data) =>
    api.post('/api/consultants/admin/create/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  adminUpdate: (id, data) =>
    api.patch(`/api/consultants/admin/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  adminDelete: (id) => api.delete(`/api/consultants/admin/${id}/`),
  adminVerify: (id, value) =>
    api.patch(`/api/consultants/admin/${id}/verify/`, { is_verified: value }),

  // Admin — Specialization Management
  adminGetSpecializations: () => api.get('/api/consultants/admin/specializations/'),
  adminCreateSpecialization: (data) => api.post('/api/consultants/admin/specializations/', data),
  adminUpdateSpecialization: (id, data) =>
    api.patch(`/api/consultants/admin/specializations/${id}/`, data),
  adminDeleteSpecialization: (id) => api.delete(`/api/consultants/admin/specializations/${id}/`),
}
