import api from '@/lib/api';

export const blogService = {
  // Public
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
    api.get('/api/admin/blogs/', { params }),

  adminGetOne: (id) =>
    api.get(`/api/admin/blogs/${id}/`),

  adminCreate: (data, config = {}) =>
    api.post('/api/admin/blogs/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),

  adminUpdate: (id, data, config = {}) =>
    api.patch(`/api/admin/blogs/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),

  adminDelete: (id) =>
    api.delete(`/api/admin/blogs/${id}/`),

  adminGetTags: () =>
    api.get('/api/admin/blogs/tags/'),

  adminCreateTag: (data) =>
    api.post('/api/admin/blogs/tags/', data),

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/api/admin/blogs/upload-image/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
};
