"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";
import Loader from "../components/Loader";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  .lp-root {
    min-height: 100vh;
    background: #f9f5ef;
    display: flex;
    align-items: stretch;
    font-family: 'Jost', sans-serif;
  }

  .lp-panel-left {
    flex: 1;
    background: linear-gradient(160deg, #1e2a1f 0%, #2d5a3d 50%, #1a3020 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
    position: relative;
    overflow: hidden;
  }

  .lp-panel-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(ellipse at 80% 20%, rgba(74,124,89,0.3) 0%, transparent 55%),
      radial-gradient(ellipse at 10% 90%, rgba(139,105,20,0.15) 0%, transparent 50%);
  }

  .lp-panel-left::after {
    content: '';
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 360px;
    height: 360px;
    border: 1px solid rgba(232,213,176,0.08);
    border-radius: 50%;
  }

  .lp-logo {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 48px;
  }

  .lp-logo-icon {
    width: 44px;
    height: 44px;
    background: rgba(74,124,89,0.3);
    border: 1px solid rgba(125,184,148,0.4);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7db894;
    font-size: 18px;
  }

  .lp-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #e8d5b0;
    letter-spacing: 0.01em;
  }

  .lp-tagline {
    position: relative;
    text-align: center;
  }

  .lp-tagline h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 700;
    color: #e8d5b0;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .lp-tagline h2 em {
    font-style: italic;
    color: #7db894;
  }

  .lp-tagline p {
    color: #8aa896;
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.7;
    max-width: 320px;
    margin: 0 auto;
  }

  .lp-dots {
    position: relative;
    display: flex;
    gap: 8px;
    margin-top: 48px;
    justify-content: center;
  }

  .lp-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(125,184,148,0.3);
  }
  .lp-dot.active { background: #7db894; }

  .lp-panel-right {
    width: 100%;
    max-width: 480px;
    background: #fefcf8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
  }

  .lp-form-header {
    width: 100%;
    margin-bottom: 36px;
  }

  .lp-form-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #2d1f0e;
    margin-bottom: 8px;
  }

  .lp-form-header p {
    color: #8a7a65;
    font-size: 0.9rem;
    font-weight: 300;
  }

  .lp-form-header p a {
    color: #2d5a3d;
    font-weight: 500;
    text-decoration: none;
  }

  .lp-form-header p a:hover { text-decoration: underline; }

  .lp-field {
    width: 100%;
    margin-bottom: 20px;
  }

  .lp-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a7a65;
    margin-bottom: 8px;
  }

  .lp-input-wrap {
    position: relative;
  }

  .lp-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #b0a090;
    font-size: 13px;
  }

  .lp-input {
    width: 100%;
    background: #f4ede0;
    border: 1px solid rgba(101,78,51,0.15);
    border-radius: 12px;
    padding: 13px 14px 13px 40px;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    color: #3d2f1e;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .lp-input::placeholder { color: #b0a090; }

  .lp-input:focus {
    border-color: rgba(74,124,89,0.5);
    background: #fefcf8;
    box-shadow: 0 0 0 3px rgba(74,124,89,0.1);
  }

  .lp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .lp-remember {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #8a7a65;
    cursor: pointer;
  }

  .lp-remember input { accent-color: #2d5a3d; }

  .lp-forgot {
    font-size: 0.82rem;
    color: #4a7c59;
    font-weight: 500;
    text-decoration: none;
  }

  .lp-forgot:hover { text-decoration: underline; }

  .lp-submit {
    width: 100%;
    background: linear-gradient(135deg, #4a7c59, #2d5a3d);
    color: #e8d5b0;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-family: 'Jost', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .lp-submit:hover {
    background: linear-gradient(135deg, #3d6b4a, #1e4028);
    box-shadow: 0 6px 20px rgba(45,90,61,0.3);
    transform: translateY(-1px);
  }

  .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .lp-error {
    width: 100%;
    background: rgba(220,53,69,0.08);
    border: 1px solid rgba(220,53,69,0.25);
    border-radius: 10px;
    padding: 12px 16px;
    color: #b5304a;
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .lp-panel-left { display: none; }
    .lp-panel-right { max-width: 100%; padding: 40px 24px; }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <style>{STYLE}</style>
      <div className="lp-root">
        {/* Left panel */}
        <div className="lp-panel-left">
          <div className="lp-logo">
            <div className="lp-logo-icon"><FaLeaf /></div>
            <span className="lp-logo-text">KrishiSahayi</span>
          </div>
          <div className="lp-tagline">
            <h2>Farm to Table,<br /><em>Direct.</em></h2>
            <p>Connect with local farmers and get the freshest produce delivered straight to you.</p>
          </div>
          <div className="lp-dots">
            <div className="lp-dot active" />
            <div className="lp-dot" />
            <div className="lp-dot" />
          </div>
        </div>

        {/* Right panel */}
        <div className="lp-panel-right">
          <div className="lp-form-header">
            <h1>Welcome back</h1>
            <p>
              New here?{" "}
              <Link to="/register">Create an account</Link>
            </p>
          </div>

          {error && <div className="lp-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div className="lp-field">
              <label className="lp-label">Email Address</label>
              <div className="lp-input-wrap">
                <FaEnvelope className="lp-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lp-input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <FaLock className="lp-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="lp-input"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="lp-row">
              <label className="lp-remember">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="lp-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="lp-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;