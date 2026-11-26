import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PUBLIC_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/recipes", label: "Recipes" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

function linkClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function NavBar() {
  const { user, loading, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="navbar">
      <div className="navbar-bar">
        <NavLink to="/" className="navbar-brand">
          Recipe Finder
        </NavLink>

        <button
          type="button"
          className={open ? "navbar-toggle open" : "navbar-toggle"}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>
      </div>

      <nav
        id="primary-nav"
        className={open ? "navbar-links open" : "navbar-links"}
      >
        {PUBLIC_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={linkClass}
          >
            {link.label}
          </NavLink>
        ))}

        {!loading && user && (
          <>
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
            <button
              type="button"
              className="nav-link nav-button"
              onClick={logOut}
            >
              Logout
            </button>
          </>
        )}

        {!loading && !user && (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className="nav-link nav-cta">
              Sign up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}