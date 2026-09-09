import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getUser, isLoggedIn, logout } from '../services/authService';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const loggedIn = isLoggedIn();
  const user = getUser();

  const handleLogout = () => {
    logout();
    setTick((t) => t + 1);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-nest">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-mark">B</span>
          <span className="brand-name">BookNest</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-nest" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-nest" to="/catalogue">
                Catalogue
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            {loggedIn && user ? (
              <>
                <li className="nav-item">
                  <span className="user-chip">
                    <span className="user-avatar">{user.fullName.trim().charAt(0).toUpperCase()}</span>
                    {user.fullName}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-nest" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-glow btn-sm px-4 py-2" to="/register">
                    Join free
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
