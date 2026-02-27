"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/slices/authSlice";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaLeaf, FaMoneyCheckAlt, FaArrowRight, FaEye, FaEyeSlash,
} from "react-icons/fa";
import Loader from "../components/Loader";

/* ─── Ambient particle canvas for left panel ─────────────────────── */
const AmbientCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.28, dy: -(Math.random() * 0.4 + 0.08),
      alpha: Math.random() * 0.35 + 0.07, pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.pulse += 0.014; p.x += p.dx; p.y += p.dy;
        if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
        if (p.x < -8) p.x = canvas.width + 8;
        if (p.x > canvas.width + 8) p.x = -8;
        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157,196,170,${a})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
};

/* ─── Floating label input ─────────────────────────────────────────── */
const FloatInput = ({ label, icon: Icon, type = "text", name, value, onChange, placeholder, required, minLength, hint, autoComplete, rightSlot }) => {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;
  const active = focused || filled;

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "relative",
        background: focused ? "#ffffff" : "#fdfaf4",
        border: `1.5px solid ${focused ? "rgba(74,124,89,0.55)" : active ? "rgba(74,124,89,0.3)" : "rgba(101,78,51,0.15)"}`,
        borderRadius: 14,
        transition: "all 0.25s",
        boxShadow: focused ? "0 0 0 4px rgba(74,124,89,0.1), 0 2px 12px rgba(74,124,89,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {/* Floating label */}
        <label style={{
          position: "absolute",
          left: Icon ? 44 : 16, top: active ? 8 : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? "0.62rem" : "0.88rem",
          fontFamily: "'DM Mono', monospace",
          fontWeight: 500,
          letterSpacing: active ? "0.12em" : "0.02em",
          textTransform: active ? "uppercase" : "none",
          color: focused ? "rgba(74,124,89,0.85)" : active ? "rgba(74,124,89,0.6)" : "rgba(101,78,51,0.45)",
          pointerEvents: "none",
          transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          zIndex: 2,
        }}>{label}</label>

        {/* Icon */}
        {Icon && (
          <div style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            color: focused ? "rgba(74,124,89,0.7)" : "rgba(101,78,51,0.3)",
            fontSize: 13, transition: "color 0.25s", zIndex: 2, pointerEvents: "none",
          }}>
            <Icon />
          </div>
        )}

        <input
          type={type} name={name} value={value} onChange={onChange}
          required={required} minLength={minLength} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder=""
          style={{
            width: "100%", background: "transparent", border: "none", outline: "none",
            padding: active ? "24px 44px 10px" : "17px 44px 17px",
            paddingLeft: Icon ? 44 : 16,
            paddingRight: rightSlot ? 44 : 16,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem", color: "#2d1f0e",
            caretColor: "#4a7c59", boxSizing: "border-box", transition: "padding 0.22s",
          }}
        />

        {rightSlot && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
            {rightSlot}
          </div>
        )}
      </div>
      {hint && (
        <p style={{ margin: "6px 0 0", fontSize: "0.72rem", color: "rgba(74,124,89,0.5)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>
          {hint}
        </p>
      )}
    </div>
  );
};

/* ─── Main ─────────────────────────────────────────────────────────── */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "consumer", phone: "", upiId: "",
    address: { street: "", city: "", state: "", zipCode: "" },
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [step, setStep] = useState(1); // 1 = basics, 2 = address+extras

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

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

  const testimonials = [
    { text: "KrishiSahayi changed how I sell. Direct to families, fair price.", name: "Ravi Kumar", role: "Farmer, Tamil Nadu" },
    { text: "The freshest vegetables I've ever had. I know exactly where they come from.", name: "Priya Nair", role: "Consumer, Kerala" },
    { text: "My income grew 40% in the first season. No more middlemen.", name: "Anand Patel", role: "Farmer, Gujarat" },
  ];
  const [quoteIdx] = useState(Math.floor(Math.random() * testimonials.length));
  const quote = testimonials[quoteIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .rg-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0b1a0d;
        }

        /* ── LEFT PANEL ── */
        .rg-left {
          position: relative;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 56px 52px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(74,124,89,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, rgba(45,90,61,0.12) 0%, transparent 55%),
            #0b1a0d;
          min-height: 100vh;
        }

        /* Grain */
        .rg-left::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Big watermark letter */
        .rg-left::after {
          content: 'K';
          position: absolute; bottom: -80px; right: -40px;
          font-family: 'Playfair Display', serif;
          font-size: 28vw; font-weight: 900; font-style: italic;
          color: rgba(157,196,170,0.025); pointer-events: none;
          line-height: 1; user-select: none; z-index: 0;
        }

        .rg-left-top { position: relative; z-index: 2; }
        .rg-left-mid  { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0; }
        .rg-left-bot  { position: relative; z-index: 2; }

        /* Logo */
        .rg-logo {
          display: inline-flex; align-items: center; gap: 12px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }

        .rg-logo-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(45,90,61,0.5);
          color: #e8d5a3; font-size: 16px;
        }

        .rg-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; font-weight: 700;
          color: rgba(232,213,163,0.9);
          letter-spacing: -0.01em;
        }

        /* Hero text */
        .rg-hero-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(157,196,170,0.5);
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both;
        }
        .rg-hero-label::after { content: ''; flex: 0 0 32px; height: 1px; background: rgba(157,196,170,0.25); }

        .rg-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 3.5vw, 3.2rem);
          font-weight: 900; color: #e8d5a3;
          line-height: 1.05; letter-spacing: -0.02em;
          margin-bottom: 20px;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both;
        }
        .rg-hero-title em { font-style: italic; color: #9dc4aa; font-weight: 400; }

        .rg-hero-body {
          font-size: 0.9rem; font-weight: 300;
          color: rgba(157,196,170,0.55);
          line-height: 1.8; max-width: 340px;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both;
        }

        /* Testimonial */
        .rg-quote {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(157,196,170,0.1);
          border-radius: 16px; padding: 22px 24px;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both;
        }
        .rg-quote-text {
          font-family: 'Playfair Display', serif;
          font-style: italic; font-size: 0.95rem;
          color: rgba(232,213,163,0.7); line-height: 1.65;
          margin-bottom: 14px;
        }
        .rg-quote-text::before { content: '"'; color: #4a7c59; font-size: 1.4rem; line-height: 0; vertical-align: -0.3em; margin-right: 4px; }
        .rg-quote-author {
          display: flex; align-items: center; gap: 10px;
        }
        .rg-quote-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem; font-weight: 700; color: #e8d5a3;
          flex-shrink: 0;
        }
        .rg-quote-name {
          font-size: 0.8rem; font-weight: 500;
          color: rgba(232,213,163,0.75); line-height: 1.2;
        }
        .rg-quote-role {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem; color: rgba(157,196,170,0.4);
          letter-spacing: 0.06em;
        }

        /* ── RIGHT PANEL ── */
        .rg-right {
          background: #f2ede3;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 72px 52px 56px;
          overflow-y: auto;
          min-height: 100vh;
          position: relative;
        }

        /* Subtle top-right glow on paper */
        .rg-right::before {
          content: '';
          position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(74,124,89,0.07) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }

        .rg-form-wrap {
          width: 100%; max-width: 440px;
          padding-top: 16px;
        }

        /* Form header */
        .rg-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 900;
          color: #0b1a0d; line-height: 1.05;
          letter-spacing: -0.02em; margin-bottom: 6px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }
        .rg-form-title em { font-style: italic; color: #4a7c59; font-weight: 400; }

        .rg-form-sub {
          font-size: 0.84rem; font-weight: 300;
          color: #7a6a55; margin-bottom: 32px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s both;
        }
        .rg-form-sub a { color: #4a7c59; font-weight: 500; text-decoration: none; }
        .rg-form-sub a:hover { color: #2d5a3d; }

        /* Error */
        .rg-error {
          background: rgba(139,58,58,0.08);
          border: 1px solid rgba(139,58,58,0.18);
          color: #7a2020; padding: 12px 16px;
          border-radius: 12px; font-size: 0.82rem;
          margin-bottom: 20px; line-height: 1.5;
          animation: fadeUp 0.4s ease both;
        }

        /* ── Role switcher ── */
        .rg-role-wrap {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 28px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both;
        }

        .rg-role-btn {
          position: relative; overflow: hidden;
          padding: 18px 14px; border-radius: 16px;
          border: 1.5px solid rgba(101,78,51,0.15);
          background: #fdfaf4; cursor: pointer;
          text-align: center; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }

        .rg-role-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          transform: translateY(105%);
          transition: transform 0.35s cubic-bezier(0.76,0,0.24,1);
          z-index: 0; border-radius: inherit;
        }

        .rg-role-btn.active::before,
        .rg-role-btn:hover::before { transform: translateY(0); }

        .rg-role-btn.active {
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(45,90,61,0.25);
          transform: translateY(-2px);
        }

        .rg-role-emoji {
          font-size: 1.6rem; position: relative; z-index: 1;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rg-role-btn.active .rg-role-emoji,
        .rg-role-btn:hover .rg-role-emoji { transform: scale(1.2) rotate(-5deg); }

        .rg-role-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; position: relative; z-index: 1;
          color: #5c4a32; transition: color 0.25s;
        }
        .rg-role-btn.active .rg-role-label,
        .rg-role-btn:hover .rg-role-label { color: #e8d5a3; }

        .rg-role-desc {
          font-size: 0.72rem; font-weight: 300;
          color: #8a7a65; position: relative; z-index: 1;
          transition: color 0.25s;
        }
        .rg-role-btn.active .rg-role-desc,
        .rg-role-btn:hover .rg-role-desc { color: rgba(232,213,163,0.6); }

        /* ── Field groups ── */
        .rg-fields { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

        .rg-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 4px 0;
        }
        .rg-divider-line { flex: 1; height: 1px; background: rgba(101,78,51,0.1); }
        .rg-divider-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: #a09080;
        }

        /* Farmer panel */
        .rg-farmer-panel {
          background: rgba(74,124,89,0.06);
          border: 1px solid rgba(74,124,89,0.14);
          border-radius: 16px; padding: 18px;
          display: flex; flex-direction: column; gap: 12px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .rg-farmer-header {
          display: flex; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: #4a7c59; font-weight: 500;
        }

        /* Address grid */
        .rg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* Light input (for address on right panel) */
        .rg-input-light {
          width: 100%;
          background: #fdfaf4;
          border: 1.5px solid rgba(101,78,51,0.15);
          border-radius: 12px; padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; color: #2d1f0e;
          outline: none; transition: all 0.22s;
          caret-color: #4a7c59;
        }
        .rg-input-light::placeholder { color: #b0a090; }
        .rg-input-light:focus {
          border-color: rgba(74,124,89,0.55);
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(74,124,89,0.1), 0 2px 12px rgba(74,124,89,0.08);
        }

        /* Submit */
        .rg-submit {
          width: 100%;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5a3; border: none; border-radius: 14px;
          padding: 16px; margin-top: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem; font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer; transition: all 0.28s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 6px 20px rgba(45,90,61,0.25);
        }
        .rg-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(45,90,61,0.35);
        }
        .rg-submit:active:not(:disabled) { transform: translateY(0); }
        .rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Show/hide password */
        .rg-pw-toggle {
          background: none; border: none; cursor: pointer; padding: 0;
          color: rgba(101,78,51,0.35); transition: color 0.2s;
          display: flex; align-items: center;
        }
        .rg-pw-toggle:hover { color: rgba(74,124,89,0.7); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: none; }
        }

        /* Responsive */
        @media (max-width: 860px) {
          .rg-root { grid-template-columns: 1fr; }
          .rg-left { display: none; }
          .rg-right { padding: 40px 28px; }
        }
      `}</style>

      <div className="rg-root">

        {/* ══ LEFT PANEL ══ */}
        <div className="rg-left">
          <AmbientCanvas />

          <div className="rg-left-top">
            <div className="rg-logo">
              
            </div>
          </div>

          <div className="rg-left-mid">
            <div className="rg-hero-label"><FaLeaf size={9} /> Join the movement</div>
            <h2 className="rg-hero-title">
              Where Farms<br />
              <em>Meet Families</em>
            </h2>
            <p className="rg-hero-body">
              A direct marketplace connecting local farmers with consumers.
              No middlemen, no compromise — just fresh food and fair trade.
            </p>
          </div>

          <div className="rg-left-bot">
            <div className="rg-quote">
              <p className="rg-quote-text">{quote.text}</p>
              <div className="rg-quote-author">
                <div className="rg-quote-avatar">{quote.name[0]}</div>
                <div>
                  <div className="rg-quote-name">{quote.name}</div>
                  <div className="rg-quote-role">{quote.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="rg-right">
          <div className="rg-form-wrap">
            <h1 className="rg-form-title">Create an <em>Account</em></h1>
            <p className="rg-form-sub">
              Already have one? <Link to="/login">Sign in</Link>
            </p>

            {(error || passwordError) && (
              <div className="rg-error">{error || passwordError}</div>
            )}

            {/* Role switcher */}
            <div className="rg-role-wrap">
              {[
                { value: "consumer", emoji: "🛒", label: "Consumer", desc: "Buy fresh produce" },
                { value: "farmer",   emoji: "🌿", label: "Farmer",   desc: "Sell your harvest" },
              ].map((r) => (
                <button
                  key={r.value} type="button"
                  className={`rg-role-btn ${formData.role === r.value ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, role: r.value })}
                >
                  <span className="rg-role-emoji">{r.emoji}</span>
                  <span className="rg-role-label">{r.label}</span>
                  <span className="rg-role-desc">{r.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rg-fields">

                {/* Name */}
                <FloatInput
                  label="Full Name" icon={FaUser}
                  name="name" value={formData.name} onChange={handleChange}
                  required autoComplete="name"
                />

                {/* Email */}
                <FloatInput
                  label="Email Address" icon={FaEnvelope} type="email"
                  name="email" value={formData.email} onChange={handleChange}
                  required autoComplete="email"
                />

                {/* Password */}
                <FloatInput
                  label="Password" icon={FaLock} type={showPw ? "text" : "password"}
                  name="password" value={formData.password} onChange={handleChange}
                  required minLength={6} autoComplete="new-password"
                  rightSlot={
                    <button type="button" className="rg-pw-toggle" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  }
                />

                {/* Confirm Password */}
                <FloatInput
                  label="Confirm Password" icon={FaLock} type={showCPw ? "text" : "password"}
                  name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  required minLength={6} autoComplete="new-password"
                  rightSlot={
                    <button type="button" className="rg-pw-toggle" onClick={() => setShowCPw(v => !v)}>
                      {showCPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  }
                />

                {/* Farmer extras */}
                {formData.role === "farmer" && (
                  <div className="rg-farmer-panel">
                    <div className="rg-farmer-header">
                      <FaLeaf size={9} /> Farmer Details
                    </div>
                    <FloatInput
                      label="Phone Number" icon={FaPhone} type="tel"
                      name="phone" value={formData.phone} onChange={handleChange} required
                    />
                    <FloatInput
                      label="UPI ID" icon={FaMoneyCheckAlt}
                      name="upiId" value={formData.upiId} onChange={handleChange} required
                      hint="Customers will pay you directly via UPI"
                    />
                  </div>
                )}

                {/* Address divider */}
                <div className="rg-divider">
                  <div className="rg-divider-line" />
                  <span className="rg-divider-text">Address</span>
                  <div className="rg-divider-line" />
                </div>

                {/* Street */}
                <div style={{ position: "relative" }}>
                  <FaMapMarkerAlt style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", color: "#a09080", fontSize: 12, zIndex: 1,
                  }} />
                  <input
                    type="text" name="address.street"
                    value={formData.address.street} onChange={handleChange}
                    className="rg-input-light" placeholder="Street address"
                    style={{ paddingLeft: 38 }}
                  />
                </div>

                {/* City / State */}
                <div className="rg-grid-2">
                  <input type="text" name="address.city" value={formData.address.city}
                    onChange={handleChange} className="rg-input-light" placeholder="City" />
                  <input type="text" name="address.state" value={formData.address.state}
                    onChange={handleChange} className="rg-input-light" placeholder="State" />
                </div>

                {/* ZIP */}
                <input type="text" name="address.zipCode" value={formData.address.zipCode}
                  onChange={handleChange} className="rg-input-light" placeholder="ZIP / Postal code" />

                {/* Submit */}
                <button type="submit" className="rg-submit" disabled={loading}>
                  {loading ? "Creating Account…" : <>Create Account <FaArrowRight size={12} /></>}
                </button>

              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default RegisterPage;