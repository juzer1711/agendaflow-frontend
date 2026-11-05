// El backend valida startAt/endAt/startTime/endTime/exceptionDate con
// z.string().datetime({ offset: true }), es decir, siempre espera un
// datetime ISO 8601 completo (con hora y offset), nunca solo "09:00" o
// solo "2026-09-01". `Date#toISOString()` produce un ISO válido con
// offset "Z", así que lo usamos como fuente de verdad.

// Combina un <input type="date"> (YYYY-MM-DD) y un <input type="time">
// (HH:mm) interpretados en la hora local del navegador, y devuelve el
// ISO datetime completo en UTC.
export const toIsoDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
};

// Para horarios semanales (SCHEDULES), el backend solo necesita la HORA;
// el día se identifica aparte con dayOfWeek. Igual exige un datetime ISO
// completo, así que anclamos a una fecha fija arbitraria.
const SCHEDULE_ANCHOR_DATE = '2000-01-01';
export const timeToIso = (timeStr) => toIsoDateTime(SCHEDULE_ANCHOR_DATE, timeStr);

// Suma minutos a un datetime ISO y devuelve otro ISO (usado para calcular
// endAt de una cita a partir de la duración del servicio).
export const addMinutesIso = (isoStr, minutes) => {
  const date = new Date(isoStr);
  date.setMinutes(date.getMinutes() + Number(minutes || 0));
  return date.toISOString();
};

// Formatea un ISO datetime como hora local legible, p. ej. "09:00 a. m.".
export const formatTime = (isoStr) => {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

// Formatea un ISO datetime como fecha local legible, p. ej. "1 sept 2026".
export const formatDate = (isoStr) => {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (isoStr) => {
  if (!isoStr) return '—';
  return `${formatDate(isoStr)} · ${formatTime(isoStr)}`;
};

// Extrae YYYY-MM-DD y HH:mm en hora local a partir de un ISO datetime,
// útiles para prellenar <input type="date"> / <input type="time">.
export const isoToDateInput = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const isoToTimeInput = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
