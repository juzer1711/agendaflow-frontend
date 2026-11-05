import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../api/services';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ServiceForm from '../components/ServiceForm';

export default function Services() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServices();
      // DELETE en el backend desactiva el servicio (status = 'INACTIVE') en
      // lugar de borrarlo, y el listado no filtra por estado — lo hacemos
      // aquí para que un servicio "eliminado" no siga apareciendo.
      setServices((data || []).filter((s) => s.status !== 'INACTIVE'));
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudieron cargar los servicios'));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await updateService(editing.serviceId, payload);
        toast.success('Servicio actualizado');
      } else {
        await createService(payload);
        toast.success('Servicio creado');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo guardar el servicio'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(toDelete.serviceId);
      toast.success('Servicio eliminado');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo eliminar el servicio'));
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} />
          Nuevo servicio
        </button>
      </div>

      {loading ? (
        <Spinner label="Cargando servicios…" />
      ) : services.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 py-16 text-center">
          <Tag size={28} className="text-ink-300" />
          <p className="font-medium text-ink-900">Aún no hay servicios</p>
          <p className="max-w-sm text-sm text-ink-500">Crea tu primer servicio para poder agendar citas.</p>
          <button onClick={openCreate} className="btn-primary mt-2">
            <Plus size={16} />
            Nuevo servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.serviceId} className="card flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-ink-900">{s.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="rounded p-1.5 text-ink-500 hover:bg-navy-50 hover:text-navy-700"
                    aria-label="Editar servicio"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setToDelete(s)}
                    className="rounded p-1.5 text-ink-500 hover:bg-danger/10 hover:text-danger"
                    aria-label="Eliminar servicio"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {s.description && <p className="text-sm text-ink-500">{s.description}</p>}
              <div className="flex items-center gap-3 text-sm text-ink-500">
                <span className="font-medium text-navy-700">
                  ${Number(s.price).toLocaleString('es-CO')}
                </span>
                <span>·</span>
                <span>{s.durationMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => setFormOpen(false)}>
          <ServiceForm service={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar servicio"
          message={`¿Seguro que quieres eliminar "${toDelete.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
