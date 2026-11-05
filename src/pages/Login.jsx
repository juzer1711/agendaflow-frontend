import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CalendarDays, Loader2, AlertTriangle } from 'lucide-react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../api/client';

export default function Login() {
  const { isAuthenticated, loginWithToken, sessionExpired, clearSessionExpired } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => clearSessionExpired(), [clearSessionExpired]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      loginWithToken(data);
      toast.success('Sesión iniciada correctamente');
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Credenciales inválidas'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-navy-900">
            <CalendarDays size={26} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-white">AgendaFlow</h1>
            <p className="text-sm text-navy-100/60">Panel de administración</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {sessionExpired && (
            <div className="flex items-start gap-2 rounded-card bg-amber-100 px-3 py-2 text-sm text-amber-600">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>Tu sesión expiró. Inicia sesión de nuevo para continuar.</span>
            </div>
          )}

          {error && (
            <div className="rounded-card bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="label-field">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-field">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
