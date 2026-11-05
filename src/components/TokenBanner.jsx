import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function TokenBanner() {
  const { token } = useAuth();
  const toast = useToast();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!token) return null;

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      toast.success('Token copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el token');
    }
  };

  return (
    <div className="border-b border-amber-500/30 bg-amber-100">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 md:px-6">
        <KeyRound size={16} className="shrink-0 text-amber-600" />
        <span className="text-sm font-medium text-ink-900">Token JWT activo</span>
        <code className="max-w-[40ch] flex-1 truncate rounded bg-white/70 px-2 py-1 text-xs text-ink-700">
          {expanded ? token : `${token.slice(0, 24)}…`}
        </code>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-ink-700 hover:text-ink-900"
        >
          {expanded ? 'Ocultar' : 'Ver completo'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={copyToken}
          className="flex items-center gap-1.5 rounded-card bg-navy-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-800"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar token'}
        </button>
      </div>
    </div>
  );
}
