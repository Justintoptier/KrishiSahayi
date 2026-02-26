"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FaLeaf,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .nav-root {
          font-family: 'Jost', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.4s ease;
          background: ${scrolled ? 'rgba(250, 246, 240, 0.97)' : '#faf6f0'};
          box-shadow: ${scrolled ? '0 2px 24px rgba(101, 78, 51, 0.12)' : '0 1px 0 rgba(101, 78, 51, 0.08)'};
          backdrop-filter: ${scrolled ? 'blur(12px)' : 'none'};
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8d5b0;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(45, 90, 61, 0.3);
        }

        .nav-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3a2e;
          letter-spacing: 0.01em;
        }

        .nav-logo-text span {
          color: #4a7c59;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: #5c4a32;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #4a7c59;
          transition: width 0.3s ease;
        }

        .nav-link:hover { color: #4a7c59; }
        .nav-link:hover::after,
        .nav-link.active::after { width: 100%; }
        .nav-link.active { color: #4a7c59; }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .cart-btn {
          position: relative;
          color: #5c4a32;
          transition: color 0.2s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .cart-btn:hover { color: #4a7c59; }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #4a7c59;
          color: #faf6f0;
          font-size: 0.65rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0e8d8;
          border: 1px solid rgba(101, 78, 51, 0.2);
          border-radius: 100px;
          padding: 8px 16px 8px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #3d2f1e;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .profile-btn:hover {
          background: #e5d9c5;
          border-color: rgba(74, 124, 89, 0.4);
        }

        .profile-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8d5b0;
          font-size: 11px;
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.12);
          border-radius: 16px;
          padding: 8px;
          min-width: 200px;
          box-shadow: 0 8px 32px rgba(50, 35, 15, 0.12);
          animation: dropIn 0.2s ease;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          color: #3d2f1e;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 400;
          transition: all 0.15s ease;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'Jost', sans-serif;
        }

        .dropdown-item:hover {
          background: #f0e8d8;
          color: #4a7c59;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(101, 78, 51, 0.1);
          margin: 6px 8px;
        }

        .btn-login {
          text-decoration: none;
          color: #5c4a32;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: color 0.2s ease;
        }

        .btn-login:hover { color: #4a7c59; }

        .btn-register {
          text-decoration: none;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 10px 22px;
          border-radius: 100px;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(45, 90, 61, 0.25);
        }

        .btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(45, 90, 61, 0.35);
        }

        .mobile-btn {
          background: none;
          border: none;
          color: #5c4a32;
          cursor: pointer;
          padding: 4px;
          display: none;
        }

        .mobile-menu {
          display: none;
          background: #fefcf8;
          border-top: 1px solid rgba(101, 78, 51, 0.1);
          padding: 1.5rem 2rem;
          flex-direction: column;
          gap: 0;
        }

        .mobile-nav-link {
          display: block;
          text-decoration: none;
          color: #5c4a32;
          font-size: 1rem;
          font-weight: 400;
          padding: 14px 0;
          border-bottom: 1px solid rgba(101, 78, 51, 0.06);
          transition: color 0.2s ease;
          letter-spacing: 0.02em;
        }

        .mobile-nav-link:hover { color: #4a7c59; }

        .mobile-auth {
          display: flex;
          gap: 12px;
          padding-top: 20px;
        }

        .mobile-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #c0392b;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 14px 0;
          border-bottom: 1px solid rgba(101, 78, 51, 0.06);
        }

        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .mobile-btn { display: block; }
          .mobile-menu { display: flex; }
        }

        .profile-wrapper { position: relative; }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <FaLeaf />
            </div>
            <span className="nav-logo-text">Krishi<span>Sahayi</span></span>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {[["Home", "/"], ["Products", "/products"], ["Farmers", "/farmers"], ["About", "/about"]].map(([label, path]) => (
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
              <div className="profile-wrapper">
                <button className="profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="profile-avatar">
                    <FaUser />
                  </div>
                  {user?.name?.split(" ")[0]}
                  <FaChevronDown size={10} style={{ opacity: 0.6 }} />
                </button>

                {isProfileOpen && (
                  <div className="dropdown">
                    {user?.role === "admin" && (
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === "farmer" && (
                      <Link to="/farmer/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        Farmer Dashboard
                      </Link>
                    )}
                    {user?.role !== "admin" && (
                      <>
                        <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                          <FaUser size={12} /> Profile
                        </Link>
                        <Link to="/orders" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                          Orders
                        </Link>
                      </>
                    )}
                    <Link to="/messages" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      Messages
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" style={{ color: "#c0392b" }} onClick={() => { handleLogout(); setIsProfileOpen(false); }}>
                      <FaSignOutAlt size={12} /> Logout
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

          {/* Mobile Toggle */}
          <button className="mobile-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {[["Home", "/"], ["Products", "/products"], ["Farmers", "/farmers"], ["About", "/about"]].map(([label, path]) => (
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
                  <Link to="/farmer/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Farmer Dashboard</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link to="/orders" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Orders</Link>
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