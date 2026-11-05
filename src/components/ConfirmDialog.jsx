import Modal from './Modal';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-ink-700">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button onClick={onConfirm} className="btn-danger px-4 py-2">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
