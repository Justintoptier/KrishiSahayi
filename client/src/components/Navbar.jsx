"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FaLeaf, FaShoppingCart, FaBars, FaTimes,
  FaUser, FaSignOutAlt, FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const profileRef = useRef(null);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { cartItems }             = useSelector((s) => s.cart);

  // Scroll: shrink + progress bar
  useEffect(() => {
    const onScroll = () => {
      const top      = window.scrollY;
      const docH     = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(top > 24);
      setScrollProgress(docH > 0 ? (top / docH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const NAV = [["Home", "/"], ["Products", "/products"], ["Farmers", "/farmers"], ["About", "/about"]];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        /* ── Root wrapper ── */
        .nav-root {
          font-family: 'Jost', sans-serif;
          position: sticky; top: 0; z-index: 1000;
        }

        /* ── Bar ── */
        .nav-bar {
          background: #faf6f0;
          border-bottom: 1px solid rgba(101,78,51,0.08);
          transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
          position: relative;
        }
        .nav-bar.scrolled {
          background: rgba(250,246,240,0.97);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 2px 28px rgba(50,30,10,0.1);
          border-bottom-color: rgba(101,78,51,0.12);
        }

        /* ── Inner ── */
        .nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 2rem;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          transition: height 0.35s ease;
        }
        .nav-inner.scrolled { height: 60px; }

        /* ── Logo ── */
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #e8d5b0; font-size: 16px;
          box-shadow: 0 2px 8px rgba(45,90,61,0.3);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
        }
        .nav-logo:hover .nav-logo-icon {
          transform: rotate(-8deg) scale(1.12);
          box-shadow: 0 4px 14px rgba(45,90,61,0.42);
        }
        .nav-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 700; color: #2d3a2e;
          letter-spacing: 0.01em;
        }
        .nav-logo-text span { color: #4a7c59; }

        /* ── Links ── */
        .nav-links {
          display: flex; align-items: center; gap: 2rem;
          list-style: none; margin: 0; padding: 0;
        }
        .nav-link {
          text-decoration: none; color: #5c4a32;
          font-size: 0.875rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          position: relative; padding: 4px 0;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute; bottom: -3px; left: 0;
          width: 0; height: 1.5px;
          background: linear-gradient(90deg, #4a7c59, #7db894);
          transition: width 0.32s cubic-bezier(0.22,1,0.36,1);
          border-radius: 2px;
        }
        .nav-link:hover { color: #4a7c59; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .nav-link.active { color: #4a7c59; }

        /* ── Actions ── */
        .nav-actions {
          display: flex; align-items: center; gap: 1.25rem;
        }

        /* Cart */
        .cart-btn {
          position: relative; color: #5c4a32;
          transition: color 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          text-decoration: none;
          display: flex; align-items: center;
        }
        .cart-btn:hover { color: #4a7c59; transform: scale(1.14); }

        .cart-badge {
          position: absolute; top: -8px; right: -8px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #faf6f0; font-size: 0.65rem; font-weight: 700;
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badge-pop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* Profile pill */
        .profile-btn {
          display: flex; align-items: center; gap: 8px;
          background: #f0e8d8; border: 1px solid rgba(101,78,51,0.2);
          border-radius: 100px; padding: 8px 16px 8px 10px;
          cursor: pointer; transition: all 0.22s ease;
          color: #3d2f1e; font-family: 'Jost', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          outline: none;
        }
        .profile-btn:hover {
          background: #e5d9c5;
          border-color: rgba(74,124,89,0.4);
        }
        .profile-btn.open {
          background: #e5d9c5;
          border-color: rgba(74,124,89,0.45);
        }

        .profile-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #e8d5b0; font-size: 11px; font-weight: 600;
        }

        .profile-chevron {
          transition: transform 0.25s ease;
          opacity: 0.55;
        }
        .profile-btn.open .profile-chevron { transform: rotate(180deg); }

        /* Dropdown */
        .dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #fefcf8;
          border: 1px solid rgba(101,78,51,0.11);
          border-radius: 16px; padding: 6px;
          min-width: 205px;
          box-shadow: 0 12px 40px rgba(40,25,10,0.14), 0 2px 8px rgba(0,0,0,0.04);
          animation: drop-in 0.22s cubic-bezier(0.22,1,0.36,1);
          transform-origin: top right;
        }
        @keyframes drop-in {
          from { opacity: 0; transform: scale(0.92) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          color: #3d2f1e; text-decoration: none;
          font-size: 0.875rem; font-weight: 400;
          transition: all 0.15s ease;
          cursor: pointer; background: transparent;
          border: none; width: 100%; text-align: left;
          font-family: 'Jost', sans-serif;
        }
        .dropdown-item:hover { background: #f0e8d8; color: #4a7c59; }
        .dropdown-item.danger { color: #c0392b; }
        .dropdown-item.danger:hover { background: rgba(192,57,43,0.07); color: #c0392b; }

        .dropdown-divider {
          height: 1px; background: rgba(101,78,51,0.09);
          margin: 5px 8px;
        }

        /* Auth buttons */
        .btn-login {
          text-decoration: none; color: #5c4a32;
          font-size: 0.875rem; font-weight: 500;
          letter-spacing: 0.04em; transition: color 0.2s;
        }
        .btn-login:hover { color: #4a7c59; }

        .btn-register {
          text-decoration: none;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0; font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.04em; padding: 10px 22px;
          border-radius: 100px; transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(45,90,61,0.25);
        }
        .btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(45,90,61,0.38);
        }

        /* Scroll progress bar */
        .nav-progress {
          position: absolute; bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, #4a7c59, #7db894, #4a7c59);
          background-size: 200%;
          animation: progress-shimmer 2s linear infinite;
          transition: width 0.12s linear;
          border-radius: 0 2px 2px 0;
          pointer-events: none;
        }
        @keyframes progress-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Mobile */
        .mobile-btn {
          background: none; border: none;
          color: #5c4a32; cursor: pointer; padding: 4px;
          display: none; transition: color 0.2s;
        }
        .mobile-btn:hover { color: #4a7c59; }

        .mobile-menu {
          background: #fefcf8;
          border-top: 1px solid rgba(101,78,51,0.08);
          padding: 1.25rem 2rem 2rem;
          display: flex; flex-direction: column; gap: 0;
          animation: mobile-in 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes mobile-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav-link {
          display: block; text-decoration: none;
          color: #5c4a32; font-size: 1rem; font-weight: 400;
          padding: 14px 0;
          border-bottom: 1px solid rgba(101,78,51,0.06);
          transition: color 0.2s, padding-left 0.2s;
          letter-spacing: 0.02em;
        }
        .mobile-nav-link:hover { color: #4a7c59; padding-left: 6px; }

        .mobile-logout {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; color: #c0392b;
          font-family: 'Jost', sans-serif; font-size: 0.9rem;
          cursor: pointer; padding: 14px 0;
          border-bottom: 1px solid rgba(101,78,51,0.06);
        }

        .mobile-auth {
          display: flex; gap: 12px; padding-top: 20px; align-items: center;
        }

        /* Profile wrapper */
        .profile-wrapper { position: relative; }

        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .mobile-btn { display: block; }
        }
      `}</style>

      <nav className="nav-root">
        <div className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
          <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>

            {/* Logo */}
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon"><FaLeaf /></div>
              <span className="nav-logo-text">Krishi<span>Sahayi</span></span>
            </Link>

            {/* Desktop Links */}
            <ul className="nav-links">
              {NAV.map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className={`nav-link ${isActive(path) ? "active" : ""}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Actions */}
            <div className="nav-actions">
              {isAuthenticated && user?.role === "consumer" && (
                <Link to="/checkout" className="cart-btn">
                  <FaShoppingCart size={18} />
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <div className="profile-wrapper" ref={profileRef}>
                  <button
                    className={`profile-btn ${isProfileOpen ? "open" : ""}`}
                    onClick={() => setIsProfileOpen((v) => !v)}
                  >
                    <div className="profile-avatar">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {user?.name?.split(" ")[0]}
                    <FaChevronDown size={10} className="profile-chevron" />
                  </button>

                  {isProfileOpen && (
                    <div className="dropdown">
                      {user?.role === "admin" && (
                        <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                          🛡️ Admin Dashboard
                        </Link>
                      )}
                      {user?.role === "farmer" && (
                        <Link to="/farmer/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                          🌱 Farmer Dashboard
                        </Link>
                      )}
                      {user?.role !== "admin" && (
                        <>
                          <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                            <FaUser size={11} /> Profile
                          </Link>
                          <Link
                            to={user?.role === "farmer" ? "/farmer/orders" : "/orders"}
                            className="dropdown-item"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            📦 Orders
                          </Link>
                        </>
                      )}
                      <Link to="/messages" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        💬 Messages
                      </Link>
                      <div className="dropdown-divider" />
                      <button
                        className="dropdown-item danger"
                        onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                      >
                        <FaSignOutAlt size={11} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-login">Login</Link>
                  <Link to="/register" className="btn-register">Join Now</Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button className="mobile-btn" onClick={() => setIsMenuOpen((v) => !v)}>
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Scroll progress line */}
          <div className="nav-progress" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {NAV.map(([label, path]) => (
              <Link key={path} to={path} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                {label}
              </Link>
            ))}
            {isAuthenticated && user?.role === "consumer" && (
              <Link to="/checkout" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                🛒 Cart ({cartItems.length})
              </Link>
            )}
            {isAuthenticated ? (
              <>
                {user?.role === "farmer" && (
                  <Link to="/farmer/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    Farmer Dashboard
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link
                  to={user?.role === "farmer" ? "/farmer/orders" : "/orders"}
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link to="/messages" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Messages</Link>
                <button className="mobile-logout" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-register" onClick={() => setIsMenuOpen(false)}>Join Now</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;