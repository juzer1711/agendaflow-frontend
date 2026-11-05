import { useCallback, useEffect, useState } from 'react';
import { Plus, Users, Info } from 'lucide-react';
import { getCustomers, createCustomer } from '../api/customers';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';

export default function Customers() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudieron cargar los clientes'));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload) => {
    try {
      await createCustomer(payload);
      toast.success('Cliente registrado');
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo registrar el cliente'));
    }
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button onClick={() => setFormOpen(true)} className="btn-primary">
          <Plus size={16} />
          Nuevo cliente
        </button>
      </div>

      <div className="mb-5 flex items-start gap-2 rounded-card bg-navy-50 px-3 py-2 text-sm text-ink-700">
        <Info size={16} className="mt-0.5 shrink-0 text-navy-700" />
        <span>
          Por ahora solo puedes registrar y consultar clientes. Editar o eliminar un cliente estará disponible
          cuando el backend agregue esos endpoints.
        </span>
      </div>

      {loading ? (
        <Spinner label="Cargando clientes…" />
      ) : customers.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 py-16 text-center">
          <Users size={28} className="text-ink-300" />
          <p className="font-medium text-ink-900">Aún no hay clientes registrados</p>
          <p className="max-w-sm text-sm text-ink-500">Registra tu primer cliente para poder agendarle citas.</p>
          <button onClick={() => setFormOpen(true)} className="btn-primary mt-2">
            <Plus size={16} />
            Nuevo cliente
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Correo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((c) => (
                <tr key={c.customerId}>
                  <td className="px-4 py-3 text-ink-900">
                    {c.firstName} {c.lastName || ''}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-ink-700">{c.whatsappPhone || '—'}</td>
                  <td className="px-4 py-3 text-ink-700">{c.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <Modal title="Nuevo cliente" onClose={() => setFormOpen(false)}>
          <CustomerForm onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
