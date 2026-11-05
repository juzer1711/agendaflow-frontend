import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toIsoDateTime } from '../utils/datetime';

const TYPES = [
  { value: 'DAY_OFF', label: 'Día de descanso' },
  { value: 'VACATION', label: 'Vacaciones' },
  { value: 'BLOCK', label: 'Bloqueo puntual' },
  { value: 'SPECIAL_HOURS', label: 'Horario especial' },
];

// SPECIAL_HOURS (y opcionalmente BLOCK) pueden llevar una franja horaria
// específica dentro del día; el resto normalmente cubre el día completo.
const NEEDS_TIME_RANGE = ['SPECIAL_HOURS', 'BLOCK'];

export default function ExceptionForm({ onSubmit, onCancel }) {
  const [date, setDate] = useState('');
  const [type, setType] = useState('DAY_OFF');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const showTimeRange = NEEDS_TIME_RANGE.includes(type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        exceptionDate: toIsoDateTime(date, '00:00'),
        startTime: showTimeRange && startTime ? toIsoDateTime(date, startTime) : null,
        endTime: showTimeRange && endTime ? toIsoDateTime(date, endTime) : null,
        type,
        reason: reason || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="label-field">Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {showTimeRange && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Hora inicio (opcional)</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Hora fin (opcional)</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      )}

      <div>
        <label className="label-field">Motivo (opcional)</label>
        <input value={reason} onChange={(e) => setReason(e.target.value)} className="input-field" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 size={16} className="animate-spin" />}
          Agregar excepción
        </button>
      </div>
    </form>
  );
}

export { TYPES };
