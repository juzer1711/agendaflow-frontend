import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, CalendarX } from 'lucide-react';
import {
  getNextAppointment,
  getTodayAppointments,
  getAppointmentsList,
  createAppointment,
  cancelAppointment,
} from '../api/appointments';
import { getCustomers } from '../api/customers';
import { getServices } from '../api/services';
import { getErrorMessage } from '../api/client';
import { formatDate, formatTime } from '../utils/datetime';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import AppointmentForm from '../components/AppointmentForm';

const TABS = [
  { id: 'next', label: 'Próxima cita' },
  { id: 'today', label: 'Citas de hoy' },
  { id: 'upcoming', label: 'Próximas' },
];

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED'];

export default function Appointments() {
  const toast = useToast();
  const [tab, setTab] = useState('next');
  const [appointments, setAppointments] = useState([]);
  const [nextMessage, setNextMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [toCancel, setToCancel] = useState(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setNextMessage('');
    try {
      if (tab === 'today') {
        const data = await getTodayAppointments();
        setAppointments(data || []);
      } else if (tab === 'upcoming') {
        // No existe /api/appointments/upcoming en el backend: lo armamos
        // filtrando la lista general por citas futuras y activas.
        const data = await getAppointmentsList(1, 100);
        const now = Date.now();
        const upcoming = (data || [])
          .filter((a) => ACTIVE_STATUSES.includes(a.status) && new Date(a.startAt).getTime() > now)
          .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
        setAppointments(upcoming);
      } else {
        const data = await getNextAppointment();
        if (data) {
          setAppointments([data]);
        } else {
          setAppointments([]);
          setNextMessage('No tienes próximas citas.');
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudieron cargar las citas'));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [tab, toast]);

  const loadReferenceData = useCallback(async () => {
    try {
      const [customersData, servicesData] = await Promise.all([getCustomers(), getServices()]);
      setCustomers(customersData || []);
      setServices(servicesData || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudieron cargar clientes/servicios'));
    }
  }, [toast]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  const handleSubmit = async (payload) => {
    try {
      await createAppointment(payload);
      toast.success('Cita agendada');
      setFormOpen(false);
      loadAppointments();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo agendar la cita'));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(toCancel.appointmentId);
      toast.success('Cita cancelada');
      setToCancel(null);
      loadAppointments();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo cancelar la cita'));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-card border border-line bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-navy-700 text-white' : 'text-ink-700 hover:bg-navy-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button onClick={() => setFormOpen(true)} className="btn-primary">
          <Plus size={16} />
          Nueva cita
        </button>
      </div>

      {loading ? (
        <Spinner label="Cargando citas…" />
      ) : appointments.length === 0 ? (
        <EmptyState tab={tab} message={nextMessage} onCreate={() => setFormOpen(true)} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {appointments.map((appt) => (
                <tr key={appt.appointmentId}>
                  <td className="px-4 py-3 text-ink-900">{appt.customer}</td>
                  <td className="px-4 py-3 text-ink-700">{appt.service}</td>
                  <td className="px-4 py-3 text-ink-700">{formatDate(appt.startAt)}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {formatTime(appt.startAt)}–{formatTime(appt.endAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {ACTIVE_STATUSES.includes(appt.status) && (
                        <button
                          onClick={() => setToCancel(appt)}
                          className="rounded p-1.5 text-ink-500 hover:bg-danger/10 hover:text-danger"
                          aria-label="Cancelar cita"
                          title="Cancelar cita"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <Modal title="Nueva cita" onClose={() => setFormOpen(false)}>
          <AppointmentForm
            customers={customers}
            services={services}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}

      {toCancel && (
        <ConfirmDialog
          title="Cancelar cita"
          message={`¿Seguro que quieres cancelar la cita de ${toCancel.customer}? Esta acción no se puede deshacer.`}
          confirmLabel="Cancelar cita"
          onConfirm={handleCancel}
          onCancel={() => setToCancel(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-600',
    CONFIRMED: 'bg-navy-100 text-navy-700',
    CANCELLED: 'bg-danger/10 text-danger',
    COMPLETED: 'bg-success/10 text-success',
  };
  const labels = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Completada',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || 'bg-navy-50 text-ink-500'}`}>
      {labels[status] || status}
    </span>
  );
}

function EmptyState({ tab, message, onCreate }) {
  const copy = {
    next: message || 'No tienes próxima cita registrada',
    today: 'No hay citas para hoy',
    upcoming: 'No hay próximas citas',
  };
  return (
    <div className="card flex flex-col items-center gap-2 py-16 text-center">
      <CalendarX size={28} className="text-ink-300" />
      <p className="font-medium text-ink-900">{copy[tab]}</p>
      <p className="max-w-sm text-sm text-ink-500">Agenda una nueva cita para verla reflejada aquí.</p>
      <button onClick={onCreate} className="btn-primary mt-2">
        <Plus size={16} />
        Nueva cita
      </button>
    </div>
  );
}
