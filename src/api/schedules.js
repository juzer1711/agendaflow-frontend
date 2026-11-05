import client, { unwrap } from './client';

// GET /api/schedules -> filas con scheduleId, dayOfWeek (1-7), startTime,
// endTime (ISO datetime), status.
export const getSchedules = () => client.get('/api/schedules').then(unwrap);

// POST /api/schedules -> { scheduleId }
// Body: { dayOfWeek: 1-7, startTime: ISO, endTime: ISO }
export const createSchedule = (payload) => client.post('/api/schedules', payload).then(unwrap);

// DELETE /api/schedules/:id -> 204
export const deleteSchedule = (id) => client.delete(`/api/schedules/${id}`).then((r) => r.data);

// GET /api/schedules/exceptions -> filas con exceptionId, exceptionDate,
// startTime, endTime, type, reason.
export const getExceptions = () => client.get('/api/schedules/exceptions').then(unwrap);

// POST /api/schedules/exceptions -> { exceptionId }
// Body: { exceptionDate: ISO, startTime?: ISO|null, endTime?: ISO|null,
//         type: 'DAY_OFF'|'VACATION'|'BLOCK'|'SPECIAL_HOURS', reason?: string }
// NOTA: no existe DELETE para excepciones todavía.
export const createException = (payload) =>
  client.post('/api/schedules/exceptions', payload).then(unwrap);
