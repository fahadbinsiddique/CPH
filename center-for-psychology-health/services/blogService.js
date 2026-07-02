import api from '@/lib/api';

export const blogService = {
  getAll: (params = {}) =>
    api.get('/api/blogs/', { params }),

  getBySlug: (slug) =>
    api.get(`/api/blogs/${slug}/`),

  getFeatured: () =>
    api.get('/api/blogs/featured/'),

  getCategories: () =>
    api.get('/api/blogs/categories/'),

  getTags: () =>
    api.get('/api/blogs/tags/'),

  // Admin
  adminGetAll: (params = {}) =>
    api.get('/api/blogs/admin/list/', { params }),

  adminCreate: (data) =>
    api.post('/api/blogs/admin/list/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  adminUpdate: (id, data) =>
    api.patch(`/api/blogs/admin/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  adminDelete: (id) =>
    api.delete(`/api/blogs/admin/${id}/`),
};