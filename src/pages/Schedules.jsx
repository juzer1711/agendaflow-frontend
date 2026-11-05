import { useCallback, useEffect, useState } from 'react';
import { Plus, Clock, CalendarOff, Trash2 } from 'lucide-react';
import { getSchedules, createSchedule, deleteSchedule, getExceptions, createException } from '../api/schedules';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { formatDate, formatTime } from '../utils/datetime';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ScheduleForm, { DAYS } from '../components/ScheduleForm';
import ExceptionForm, { TYPES } from '../components/ExceptionForm';

const dayLabel = (value) => DAYS.find((d) => d.value === Number(value))?.label || value;
const typeLabel = (value) => TYPES.find((t) => t.value === value)?.label || value;

export default function Schedules() {
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [loadingExceptions, setLoadingExceptions] = useState(true);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [exceptionFormOpen, setExceptionFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const loadSchedules = useCallback(async () => {
    setLoadingSchedules(true);
    try {
      const data = await getSchedules();
      setSchedules(data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo cargar el horario'));
    } finally {
      setLoadingSchedules(false);
    }
  }, [toast]);

  const loadExceptions = useCallback(async () => {
    setLoadingExceptions(true);
    try {
      const data = await getExceptions();
      setExceptions(data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudieron cargar las excepciones'));
    } finally {
      setLoadingExceptions(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSchedules();
    loadExceptions();
  }, [loadSchedules, loadExceptions]);

  const handleScheduleSubmit = async (payload) => {
    try {
      await createSchedule(payload);
      toast.success('Horario guardado');
      setScheduleFormOpen(false);
      loadSchedules();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo guardar el horario'));
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      await deleteSchedule(toDelete.scheduleId);
      toast.success('Horario eliminado');
      setToDelete(null);
      loadSchedules();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo eliminar el horario'));
    }
  };

  const handleExceptionSubmit = async (payload) => {
    try {
      await createException(payload);
      toast.success('Excepción agregada');
      setExceptionFormOpen(false);
      loadExceptions();
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo agregar la excepción'));
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Horario semanal</h2>
          <button onClick={() => setScheduleFormOpen(true)} className="btn-secondary">
            <Plus size={16} />
            Agregar día
          </button>
        </div>

        {loadingSchedules ? (
          <Spinner label="Cargando horario…" />
        ) : schedules.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 py-12 text-center">
            <Clock size={26} className="text-ink-300" />
            <p className="font-medium text-ink-900">Aún no has configurado tu horario</p>
            <p className="max-w-sm text-sm text-ink-500">
              Agrega los días y horas en los que atiendes citas.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Día</th>
                  <th className="px-4 py-3 font-medium">Hora inicio</th>
                  <th className="px-4 py-3 font-medium">Hora fin</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {schedules.map((s) => (
                  <tr key={s.scheduleId}>
                    <td className="px-4 py-3 text-ink-900">{dayLabel(s.dayOfWeek)}</td>
                    <td className="px-4 py-3 text-ink-700">{formatTime(s.startTime)}</td>
                    <td className="px-4 py-3 text-ink-700">{formatTime(s.endTime)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setToDelete(s)}
                          className="rounded p-1.5 text-ink-500 hover:bg-danger/10 hover:text-danger"
                          aria-label="Eliminar horario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Excepciones y descansos</h2>
          <button onClick={() => setExceptionFormOpen(true)} className="btn-secondary">
            <Plus size={16} />
            Agregar excepción
          </button>
        </div>

        {loadingExceptions ? (
          <Spinner label="Cargando excepciones…" />
        ) : exceptions.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 py-12 text-center">
            <CalendarOff size={26} className="text-ink-300" />
            <p className="font-medium text-ink-900">No hay excepciones registradas</p>
            <p className="max-w-sm text-sm text-ink-500">
              Registra festivos, vacaciones o días puntuales sin atención.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Horario</th>
                  <th className="px-4 py-3 font-medium">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {exceptions.map((ex) => (
                  <tr key={ex.exceptionId}>
                    <td className="px-4 py-3 text-ink-900">{formatDate(ex.exceptionDate)}</td>
                    <td className="px-4 py-3 text-ink-700">{typeLabel(ex.type)}</td>
                    <td className="px-4 py-3 text-ink-700">
                      {ex.startTime && ex.endTime
                        ? `${formatTime(ex.startTime)}–${formatTime(ex.endTime)}`
                        : 'Todo el día'}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{ex.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {scheduleFormOpen && (
        <Modal title="Agregar día de trabajo" onClose={() => setScheduleFormOpen(false)}>
          <ScheduleForm onSubmit={handleScheduleSubmit} onCancel={() => setScheduleFormOpen(false)} />
        </Modal>
      )}

      {exceptionFormOpen && (
        <Modal title="Agregar excepción" onClose={() => setExceptionFormOpen(false)}>
          <ExceptionForm onSubmit={handleExceptionSubmit} onCancel={() => setExceptionFormOpen(false)} />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar horario"
          message={`¿Seguro que quieres eliminar el horario de ${dayLabel(toDelete.dayOfWeek)}?`}
          confirmLabel="Eliminar"
          onConfirm={handleDeleteSchedule}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
