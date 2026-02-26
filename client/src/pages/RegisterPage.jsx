"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/slices/authSlice";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaLeaf, FaMoneyCheckAlt,
} from "react-icons/fa";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "consumer", phone: "", upiId: "",
    address: { street: "", city: "", state: "", zipCode: "" },
  });
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      if (user?.role === "admin") navigate("/admin/dashboard");
      else if (user?.role === "farmer") navigate("/farmer/dashboard");
      else navigate("/");
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    const { confirmPassword, ...userData } = formData;
    dispatch(register(userData));
  };

  if (loading) return <Loader />;

  const inputStyle = {
    width: "100%",
    background: "#f4ede0",
    border: "1px solid rgba(101, 78, 51, 0.15)",
    borderRadius: 12,
    padding: "13px 16px 13px 40px",
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.9rem",
    color: "#3d2f1e",
    outline: "none",
    boxSizing: "border-box",
  };

  const inputStyleNoIcon = { ...inputStyle, paddingLeft: 16 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .rp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 60px 1rem;
          position: relative;
          overflow: hidden;
        }

        .rp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse at 10% 60%, rgba(45, 90, 61, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 30%, rgba(139, 105, 20, 0.06) 0%, transparent 40%);
        }

        .rp-card {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.12);
          border-radius: 28px;
          padding: 48px 44px;
          width: 100%;
          max-width: 520px;
          position: relative;
          box-shadow: 0 20px 60px rgba(30, 42, 31, 0.08);
        }

        .rp-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
        }

        .rp-brand-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #2d5a3d, #4a7c59);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 6px 20px rgba(45, 90, 61, 0.3);
        }

        .rp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #1e2a1f;
          margin-bottom: 6px;
          text-align: center;
          line-height: 1.1;
        }

        .rp-title em { font-style: italic; color: #4a7c59; }

        .rp-subtitle {
          font-size: 0.875rem;
          color: #8a7a65;
          text-align: center;
          font-weight: 300;
        }

        .rp-subtitle a {
          color: #4a7c59;
          font-weight: 500;
          text-decoration: none;
        }

        .rp-subtitle a:hover { color: #2d5a3d; }

        .rp-error {
          background: rgba(139, 58, 58, 0.08);
          border: 1px solid rgba(139, 58, 58, 0.2);
          color: #7a2020;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 20px;
        }

        .rp-form { display: flex; flex-direction: column; gap: 16px; }

        .rp-field { display: flex; flex-direction: column; gap: 7px; }

        .rp-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #6b5c45;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .rp-input-wrap { position: relative; }

        .rp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #a09080;
          font-size: 13px;
          pointer-events: none;
        }

        .rp-input {
          width: 100%;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 12px;
          padding: 13px 16px 13px 40px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .rp-input-plain {
          width: 100%;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .rp-input::placeholder, .rp-input-plain::placeholder { color: #b0a090; }

        .rp-input:focus, .rp-input-plain:focus {
          border-color: rgba(74, 124, 89, 0.45);
          background: #fefcf8;
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
        }

        /* Role toggle */
        .rp-role-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .rp-role-option {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(101, 78, 51, 0.15);
          background: #f4ede0;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          color: #6b5c45;
          font-weight: 400;
        }

        .rp-role-option:hover, .rp-role-option.active {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border-color: transparent;
        }

        .rp-role-icon { font-size: 1.2rem; margin-bottom: 4px; }

        /* Address grid */
        .rp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* Farmer section */
        .rp-farmer-section {
          background: rgba(74, 124, 89, 0.07);
          border: 1px solid rgba(74, 124, 89, 0.15);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rp-farmer-label {
          font-size: 0.8rem;
          color: #4a7c59;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .rp-hint {
          font-size: 0.75rem;
          color: #a09080;
          margin-top: 5px;
          font-weight: 300;
        }

        .rp-section-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #8a7a65;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .rp-submit {
          width: 100%;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 14px;
          padding: 15px;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-top: 4px;
        }

        .rp-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(45, 90, 61, 0.35);
        }

        .rp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="rp-root">
        <div className="rp-card">
          <div className="rp-brand">
            <div className="rp-brand-icon">
              <FaLeaf style={{ color: "#e8d5b0", fontSize: 22 }} />
            </div>
            <h1 className="rp-title">Create an <em>Account</em></h1>
            <p className="rp-subtitle">
              Already have one? <Link to="/login">Sign in</Link>
            </p>
          </div>

          {(error || passwordError) && (
            <div className="rp-error">{error || passwordError}</div>
          )}

          <form className="rp-form" onSubmit={handleSubmit}>
            {/* Role toggle */}
            <div className="rp-field">
              <span className="rp-label">I am a</span>
              <div className="rp-role-toggle">
                <button
                  type="button"
                  className={`rp-role-option ${formData.role === "consumer" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, role: "consumer" })}
                >
                  <div className="rp-role-icon">🛒</div>
                  Consumer
                </button>
                <button
                  type="button"
                  className={`rp-role-option ${formData.role === "farmer" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, role: "farmer" })}
                >
                  <div className="rp-role-icon">🌿</div>
                  Farmer
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="rp-field">
              <label className="rp-label">Full Name</label>
              <div className="rp-input-wrap">
                <FaUser className="rp-input-icon" />
                <input type="text" name="name" required value={formData.name}
                  onChange={handleChange} className="rp-input" placeholder="Your full name" />
              </div>
            </div>

            {/* Email */}
            <div className="rp-field">
              <label className="rp-label">Email Address</label>
              <div className="rp-input-wrap">
                <FaEnvelope className="rp-input-icon" />
                <input type="email" name="email" autoComplete="email" required value={formData.email}
                  onChange={handleChange} className="rp-input" placeholder="you@example.com" />
              </div>
            </div>

            {/* Password */}
            <div className="rp-field">
              <label className="rp-label">Password</label>
              <div className="rp-input-wrap">
                <FaLock className="rp-input-icon" />
                <input type="password" name="password" required value={formData.password}
                  onChange={handleChange} className="rp-input" placeholder="••••••••" minLength="6" />
              </div>
            </div>

            <div className="rp-field">
              <label className="rp-label">Confirm Password</label>
              <div className="rp-input-wrap">
                <FaLock className="rp-input-icon" />
                <input type="password" name="confirmPassword" required value={formData.confirmPassword}
                  onChange={handleChange} className="rp-input" placeholder="••••••••" minLength="6" />
              </div>
            </div>

            {/* Farmer-only fields */}
            {formData.role === "farmer" && (
              <div className="rp-farmer-section">
                <p className="rp-farmer-label">🌱 Farmer Details</p>

                <div className="rp-field">
                  <label className="rp-label">Phone Number</label>
                  <div className="rp-input-wrap">
                    <FaPhone className="rp-input-icon" />
                    <input type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} className="rp-input" placeholder="Your phone number" required />
                  </div>
                </div>

                <div className="rp-field">
                  <label className="rp-label">UPI ID</label>
                  <div className="rp-input-wrap">
                    <FaMoneyCheckAlt className="rp-input-icon" />
                    <input type="text" name="upiId" value={formData.upiId}
                      onChange={handleChange} className="rp-input" placeholder="yourname@upi" required />
                  </div>
                  <p className="rp-hint">Customers will use this to pay you via UPI</p>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="rp-field">
              <label className="rp-label">Address</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="rp-input-wrap">
                  <FaMapMarkerAlt className="rp-input-icon" />
                  <input type="text" name="address.street" value={formData.address.street}
                    onChange={handleChange} className="rp-input" placeholder="Street address" />
                </div>
                <div className="rp-grid-2">
                  <input type="text" name="address.city" value={formData.address.city}
                    onChange={handleChange} className="rp-input-plain" placeholder="City" />
                  <input type="text" name="address.state" value={formData.address.state}
                    onChange={handleChange} className="rp-input-plain" placeholder="State" />
                </div>
                <input type="text" name="address.zipCode" value={formData.address.zipCode}
                  onChange={handleChange} className="rp-input-plain" placeholder="ZIP / Postal code" />
              </div>
            </div>

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;