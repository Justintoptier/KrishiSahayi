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
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { cartItems }             = useSelector((s) => s.cart);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

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

        /* ── Root: sits above hero ── */
        .nav-root {
          font-family: 'Jost', sans-serif;
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 16px 24px;
          pointer-events: none;
        }

        /* ── Floating pill container ── */
        .nav-bar {
          max-width: 1100px;
          margin: 0 auto;
          background: rgba(240, 234, 220, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 100px;
          box-shadow:
            0 4px 24px rgba(0,0,0,0.12),
            0 1px 0 rgba(255,255,255,0.4) inset;
          transition:
            background 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
          pointer-events: all;
          position: relative;
          overflow: visible;
        }



        /* ── Inner ── */
        .nav-inner {
          height: 58px;
          padding: 0 28px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px;
        }

        /* ── Logo ── */
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #e8d5b0; font-size: 15px;
          box-shadow: 0 2px 8px rgba(45,90,61,0.32);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
        }
        .nav-logo:hover .nav-logo-icon {
          transform: rotate(-8deg) scale(1.12);
          box-shadow: 0 4px 14px rgba(45,90,61,0.44);
        }
        .nav-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem; font-weight: 700;
          color: #2d3a2e; letter-spacing: 0.01em;
        }
        .nav-logo-text span { color: #4a7c59; }

        /* ── Centre divider ── */
        .nav-divider {
          width: 1px; height: 22px;
          background: rgba(101,78,51,0.18);
          flex-shrink: 0;
        }

        /* ── Links ── */
        .nav-links {
          display: flex; align-items: center; gap: 1.75rem;
          list-style: none; margin: 0; padding: 0;
          flex: 1; justify-content: center;
        }
        .nav-link {
          text-decoration: none; color: #4a3728;
          font-size: 0.83rem; font-weight: 500;
          letter-spacing: 0.05em; text-transform: uppercase;
          position: relative; padding: 4px 0;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1.5px;
          background: linear-gradient(90deg, #4a7c59, #7db894);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
          border-radius: 2px;
        }
        .nav-link:hover,
        .nav-link.active { color: #3a6647; }
        .nav-link:hover::after,
        .nav-link.active::after { width: 100%; }

        /* ── Actions ── */
        .nav-actions {
          display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
        }

        /* Cart */
        .cart-btn {
          position: relative; color: #4a3728;
          transition: color 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          text-decoration: none;
          display: flex; align-items: center;
        }
        .cart-btn:hover { color: #3a6647; transform: scale(1.14); }
        .cart-badge {
          position: absolute; top: -8px; right: -8px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #faf6f0; font-size: 0.62rem; font-weight: 700;
          width: 17px; height: 17px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badge-pop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* Auth buttons */
        .btn-login {
          text-decoration: none; color: #4a3728;
          font-size: 0.83rem; font-weight: 500;
          letter-spacing: 0.04em; transition: color 0.2s;
        }
        .btn-login:hover { color: #3a6647; }

        .btn-register {
          text-decoration: none;
          background: linear-gradient(135deg, #3a5c46, #1e3a27);
          color: #e8d5b0; font-size: 0.82rem; font-weight: 500;
          letter-spacing: 0.04em; padding: 9px 22px;
          border-radius: 100px;
          transition: all 0.25s ease;
          box-shadow: 0 2px 10px rgba(30,58,39,0.35);
        }
        .btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(30,58,39,0.45);
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
        }

        /* Profile pill */
        .profile-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.3);
          border: 1px solid rgba(101,78,51,0.18);
          border-radius: 100px; padding: 6px 14px 6px 8px;
          cursor: pointer; transition: all 0.22s ease;
          color: #3d2f1e; font-family: 'Jost', sans-serif;
          font-size: 0.83rem; font-weight: 500;
          outline: none;
        }
        .profile-btn:hover,
        .profile-btn.open {
          background: rgba(255,255,255,0.5);
          border-color: rgba(74,124,89,0.35);
        }
        .profile-avatar {
          width: 26px; height: 26px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #e8d5b0; font-size: 10px; font-weight: 600;
        }
        .profile-chevron {
          transition: transform 0.25s ease; opacity: 0.5;
        }
        .profile-btn.open .profile-chevron { transform: rotate(180deg); }

        /* Profile wrapper + dropdown */
        .profile-wrapper { position: relative; }
        .dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: rgba(254,252,248,0.97);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(101,78,51,0.11);
          border-radius: 16px; padding: 6px;
          min-width: 200px;
          box-shadow: 0 12px 40px rgba(40,25,10,0.16);
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
        .dropdown-item.danger:hover { background: rgba(192,57,43,0.07); }
        .dropdown-divider {
          height: 1px; background: rgba(101,78,51,0.09); margin: 5px 8px;
        }



        /* Mobile */
        .mobile-btn {
          background: none; border: none;
          color: #4a3728; cursor: pointer; padding: 4px;
          display: none; transition: color 0.2s;
        }
        .mobile-btn:hover { color: #3a6647; }

        /* Mobile menu — drops below the pill */
        .mobile-menu {
          max-width: 1100px;
          margin: 10px auto 0;
          background: rgba(245, 240, 230, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 20px;
          padding: 1rem 1.5rem 1.5rem;
          display: flex; flex-direction: column; gap: 0;
          animation: mobile-in 0.28s cubic-bezier(0.22,1,0.36,1);
          pointer-events: all;
        }
        @keyframes mobile-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-nav-link {
          display: block; text-decoration: none;
          color: #4a3728; font-size: 1rem; font-weight: 400;
          padding: 13px 0;
          border-bottom: 1px solid rgba(101,78,51,0.07);
          transition: color 0.2s, padding-left 0.2s;
        }
        .mobile-nav-link:hover { color: #3a6647; padding-left: 6px; }
        .mobile-logout {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; color: #c0392b;
          font-family: 'Jost', sans-serif; font-size: 0.9rem;
          cursor: pointer; padding: 13px 0;
          border-bottom: 1px solid rgba(101,78,51,0.07);
        }
        .mobile-auth {
          display: flex; gap: 12px; padding-top: 18px; align-items: center;
        }

        @media (max-width: 768px) {
          .nav-links, .nav-actions, .nav-divider { display: none; }
          .mobile-btn { display: block; }
          .nav-root { padding: 12px 16px; }
        }
      `}</style>

      <nav className="nav-root">
        {/* Floating pill */}
        <div className="nav-bar">
          <div className="nav-inner">

            {/* Logo */}
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon"><FaLeaf /></div>
              <span className="nav-logo-text">Krishi<span>Sahayi</span></span>
            </Link>

            {/* Divider */}
            <div className="nav-divider" />

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

            {/* Divider */}
            <div className="nav-divider" />

            {/* Desktop Actions */}
            <div className="nav-actions">
              {isAuthenticated && user?.role === "consumer" && (
                <Link to="/checkout" className="cart-btn">
                  <FaShoppingCart size={17} />
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
              {isMenuOpen ? <FaTimes size={21} /> : <FaBars size={21} />}
            </button>
          </div>


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