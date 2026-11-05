import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Cargando…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-10 text-ink-500 ${className}`}>
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
