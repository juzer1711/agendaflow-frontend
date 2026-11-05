import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ServiceForm({ service, onSubmit, onCancel }) {
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [price, setPrice] = useState(service?.price ?? '');
  const [duration, setDuration] = useState(service?.durationMinutes ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        name,
        description: description || null,
        price: Number(price),
        durationMinutes: Number(duration),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field">Nombre del servicio</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          placeholder="Corte de cabello"
        />
      </div>
      <div>
        <label className="label-field">Descripción (opcional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Precio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Duración (min)</label>
          <input
            type="number"
            min="1"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 size={16} className="animate-spin" />}
          {service ? 'Guardar cambios' : 'Crear servicio'}
        </button>
      </div>
    </form>
  );
}
