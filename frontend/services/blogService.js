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
    api.get('/api/blogs/admin/list/', { params }),

  adminGetOne: (id) =>
    api.get(`/api/blogs/admin/${id}/`),

  adminCreate: (data, config = {}) =>
    api.post('/api/blogs/admin/list/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),

  adminUpdate: (id, data, config = {}) =>
    api.patch(`/api/blogs/admin/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),

  adminDelete: (id) =>
    api.delete(`/api/blogs/admin/${id}/`),

  adminGetTags: () =>
    api.get('/api/blogs/admin/tags/'),

  adminCreateTag: (data) =>
    api.post('/api/blogs/admin/tags/', data),

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/api/blogs/admin/upload-image/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
};
