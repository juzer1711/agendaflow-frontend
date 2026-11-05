import client, { unwrap } from './client';

// GET /api/services -> filas con serviceId, name, description, price,
// durationMinutes, status, createdAt, updatedAt.
export const getServices = (page = 1, limit = 100) =>
  client.get('/api/services', { params: { page, limit } }).then(unwrap);

// POST /api/services -> { serviceId }
export const createService = (payload) => client.post('/api/services', payload).then(unwrap);

// PUT /api/services/:id -> 204 sin cuerpo
export const updateService = (id, payload) =>
  client.put(`/api/services/${id}`, payload).then((r) => r.data);

// DELETE /api/services/:id -> 204 (desactiva el servicio)
export const deleteService = (id) => client.delete(`/api/services/${id}`).then((r) => r.data);
