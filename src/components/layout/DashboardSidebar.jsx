import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function DashboardSidebar({ title, navItems, open, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-100 bg-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
          <Link to="/" className="font-display text-lg font-bold text-ink-900">
            Saran Bhai
          </Link>
          <button onClick={onClose} className="text-ink-500 lg:hidden" aria-label="Close menu">
            <FiX size={20} />
          </button>
        </div>

        <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
          {title}
        </p>

        <nav className="flex-1 space-y-1 px-3 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-chili-50 text-chili-600" : "text-ink-600 hover:bg-ink-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 p-4">
          <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
          <p className="truncate text-xs text-ink-500">{user?.email}</p>
          <button onClick={handleLogout} className="btn-outline mt-3 w-full gap-2 text-sm">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
