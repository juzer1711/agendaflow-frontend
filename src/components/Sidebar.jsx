import { NavLink } from 'react-router-dom';
import { CalendarClock, Tag, Clock, Users, CalendarDays } from 'lucide-react';

const links = [
  { to: '/', label: 'Citas', icon: CalendarClock, end: true },
  { to: '/servicios', label: 'Servicios', icon: Tag },
  { to: '/horarios', label: 'Horarios', icon: Clock },
  { to: '/clientes', label: 'Clientes', icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-navy-900 px-3 py-5 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-navy-900">
          <CalendarDays size={18} strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-semibold text-white">AgendaFlow</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-100/70 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="px-2 text-xs text-navy-100/40">Panel de administración</p>
    </aside>
  );
}
