import client, { unwrap } from './client';

// GET /api/appointments -> lista paginada (page, limit; máx 100).
// La usamos también para construir la pestaña "Próximas" filtrando en el
// cliente, ya que el backend no expone un endpoint /upcoming dedicado.
export const getAppointmentsList = (page = 1, limit = 100) =>
  client.get('/api/appointments', { params: { page, limit } }).then(unwrap);

// GET /api/appointments/next -> una cita "limpia" o null (con message).
export const getNextAppointment = () => client.get('/api/appointments/next').then(unwrap);

// GET /api/appointments/today
export const getTodayAppointments = () => client.get('/api/appointments/today').then(unwrap);

// POST /api/appointments
// Body: { customerId, serviceId, startAt (ISO datetime), endAt (ISO datetime), source, notes? }
// Respuesta: { appointmentId }
export const createAppointment = (payload) =>
  client.post('/api/appointments', payload).then(unwrap);

// PATCH /api/appointments/:id/cancel -> 204 (no hay edición ni borrado real,
// solo cancelación).
export const cancelAppointment = (id) =>
  client.patch(`/api/appointments/${id}/cancel`).then((r) => r.data);
