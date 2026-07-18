import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { DASHBOARD_PATH, ROLES } from "../../utils/constants";
import { getInitials } from "../../utils/formatters";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/my-orders", label: "My orders" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout, role } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const isCustomer = !role || role === ROLES.CUSTOMER;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-ink-50/95 backdrop-blur">
      <nav className="page-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-chili-500 text-white">
            🍲
          </span>
          Saran Bhai
        </Link>

        {isCustomer && (
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-chili-50 text-chili-600" : "text-ink-600 hover:text-ink-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {isCustomer && (
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-100"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-chili-500 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              {!isCustomer && (
                <Link to={DASHBOARD_PATH[role]} className="btn-ghost gap-2">
                  <FiClock size={16} /> Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white"
                aria-label="Profile"
              >
                {getInitials(user?.name) || <FiUser size={16} />}
              </Link>
              <button onClick={handleLogout} className="btn-ghost gap-2">
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-100 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {isCustomer &&
              NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-chili-50 text-chili-600" : "text-ink-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

            {isAuthenticated ? (
              <>
                {!isCustomer && (
                  <Link
                    to={DASHBOARD_PATH[role]}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-chili-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-chili-600"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
