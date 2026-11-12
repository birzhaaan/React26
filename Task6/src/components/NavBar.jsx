import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PUBLIC_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/recipes", label: "Recipes" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

export default function NavBar() {
  const { user, loading, logOut } = useAuth();

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        Recipe Finder
      </NavLink>

      <nav className="navbar-links">
        {PUBLIC_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}

        {!loading && user && (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Profile
            </NavLink>
            <button className="nav-link nav-button" onClick={logOut}>
              Logout
            </button>
          </>
        )}

        {!loading && !user && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
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