import api from '@/lib/api';

export const appointmentService = {
  create: (data) =>
    api.post('/api/appointments/create/', data),

  getAll: () =>
    api.get('/api/appointments/'),

  getById: (id) =>
    api.get(`/api/appointments/${id}/`),

  updateStatus: (id, data) =>
    api.patch(`/api/appointments/${id}/status/`, data),

  getBookedSlots: (consultantId, date) =>
    api.get(`/api/appointments/booked-slots/${consultantId}/`, {
      params: { date }
    }),
};