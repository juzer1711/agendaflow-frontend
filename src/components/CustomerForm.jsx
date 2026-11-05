import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CustomerForm({ onSubmit, onCancel }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        firstName,
        lastName: lastName || null,
        phone: phone || null,
        whatsappPhone: (sameAsPhone ? phone : whatsappPhone) || null,
        email: email || null,
        notes: notes || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Nombre</label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Apellido</label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="label-field">Teléfono</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          placeholder="+57 300 000 0000"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={sameAsPhone}
            onChange={(e) => setSameAsPhone(e.target.checked)}
            className="rounded border-line"
          />
          El WhatsApp es el mismo teléfono
        </label>
        {!sameAsPhone && (
          <input
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            className="input-field mt-2"
            placeholder="+57 300 000 0000"
          />
        )}
      </div>

      <div>
        <label className="label-field">Correo (opcional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field"
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 size={16} className="animate-spin" />}
          Registrar cliente
        </button>
      </div>
    </form>
  );
}
