import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toIsoDateTime, addMinutesIso, formatTime } from '../utils/datetime';

// El backend solo soporta CREAR citas (no editar); cancelar es una acción
// aparte (ver ConfirmDialog en Appointments.jsx). Este formulario siempre
// crea una cita nueva.
export default function AppointmentForm({ customers, services, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedService = services.find((s) => String(s.serviceId) === String(serviceId));

  const startAt = useMemo(() => toIsoDateTime(date, time), [date, time]);
  const endAt = useMemo(
    () => (startAt && selectedService ? addMinutesIso(startAt, selectedService.durationMinutes) : null),
    [startAt, selectedService]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startAt || !endAt) return;
    setSaving(true);
    try {
      await onSubmit({
        customerId: Number(customerId),
        serviceId: Number(serviceId),
        startAt,
        endAt,
        source: 'ADMIN',
        notes: notes || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field">Cliente</label>
        <select
          required
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="input-field"
        >
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {customers.map((c) => (
            <option key={c.customerId} value={c.customerId}>
              {c.firstName} {c.lastName || ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field">Servicio</label>
        <select
          required
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="input-field"
        >
          <option value="" disabled>
            Selecciona un servicio
          </option>
          {services.map((s) => (
            <option key={s.serviceId} value={s.serviceId}>
              {s.name} · {s.durationMinutes} min
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Fecha</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Hora de inicio</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {endAt && (
        <p className="text-sm text-ink-500">
          La cita terminará aprox. a las <span className="font-medium text-ink-900">{formatTime(endAt)}</span>{' '}
          (según la duración del servicio seleccionado).
        </p>
      )}

      <div>
        <label className="label-field">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={saving || !endAt} className="btn-primary">
          {saving && <Loader2 size={16} className="animate-spin" />}
          Agendar cita
        </button>
      </div>
    </form>
  );
}
