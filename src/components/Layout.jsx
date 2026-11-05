import { Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TokenBanner from './TokenBanner';
import { useAuth } from '../context/AuthContext';

const TITLES = {
  '/': 'Citas',
  '/servicios': 'Servicios',
  '/horarios': 'Horarios y excepciones',
  '/clientes': 'Clientes',
};

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const title = TITLES[location.pathname] || 'AgendaFlow';

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      {/* Nav móvil simple */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 bg-navy-900/95 p-6 md:hidden">
          <button
            onClick={() => setMobileNavOpen(false)}
            className="mb-6 text-navy-100"
          >
            Cerrar
          </button>
          {Object.entries(TITLES).map(([path, label]) => (
            <a
              key={path}
              href={path}
              className="block py-3 text-lg font-medium text-white"
            >
              {label}
            </a>
          ))}
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <TokenBanner />
        <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="text-ink-700 md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-xl font-semibold text-ink-900">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-sm text-ink-500 sm:inline">{user.email}</span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-card px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-navy-50"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
