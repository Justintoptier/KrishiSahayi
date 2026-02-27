"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaLeaf, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

/* ── Botanical particle canvas ── */
const BotanicalCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Leaf shape helper
    const drawLeaf = (ctx, x, y, size, angle, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.8, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.8, -size * 0.5, 0, -size);
      ctx.fillStyle = "rgba(125,184,148,1)";
      ctx.fill();
      // vein
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.9);
      ctx.lineTo(0, size * 0.9);
      ctx.strokeStyle = "rgba(45,90,61,0.4)";
      ctx.lineWidth = size * 0.06;
      ctx.stroke();
      ctx.restore();
    };

    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 900,
      size: Math.random() * 10 + 5,
      angle: Math.random() * Math.PI * 2,
      dAngle: (Math.random() - 0.5) * 0.008,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.18 + 0.04,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Rings
    const rings = Array.from({ length: 3 }, (_, i) => ({
      r: 180 + i * 120,
      alpha: 0.04 - i * 0.01,
      phase: (i * Math.PI * 2) / 3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Concentric rings
      rings.forEach((ring) => {
        ring.phase += 0.003;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r + Math.sin(ring.phase) * 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(125,184,148,${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Floating leaves
      particles.forEach((p) => {
        p.pulse += 0.02;
        p.angle += p.dAngle;
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        drawLeaf(ctx, p.x, p.y, p.size, p.angle, a);
      });

      // Floating dots
      for (let i = 0; i < 40; i++) {
        const t = (Date.now() * 0.0002 + i * 0.7) % 1;
        const x = ((i * 137.5) % canvas.width);
        const y = canvas.height - t * (canvas.height + 60) + 30;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,210,${0.06 + Math.sin(t * Math.PI) * 0.06})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

/* ── Floating label input ── */
const FloatingInput = ({ id, label, type: initialType, value, onChange, icon: Icon, error }) => {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPw = initialType === "password";
  const type = isPw ? (showPw ? "text" : "password") : initialType;
  const lifted = focused || value;

  return (
    <div style={{ position: "relative", marginBottom: error ? 6 : 24 }}>
      <div style={{
        position: "relative",
        background: focused ? "#fff" : "#f5ede0",
        border: `1.5px solid ${error ? "#c0392b" : focused ? "#4a7c59" : "rgba(101,78,51,0.15)"}`,
        borderRadius: 14,
        transition: "all 0.25s ease",
        boxShadow: focused ? "0 0 0 3px rgba(74,124,89,0.1)" : "none",
      }}>
        {/* Floating label */}
        <label htmlFor={id} style={{
          position: "absolute",
          left: 44,
          top: lifted ? 8 : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? "0.68rem" : "0.9rem",
          fontWeight: lifted ? 600 : 400,
          color: error ? "#c0392b" : lifted ? "#4a7c59" : "#a09080",
          letterSpacing: lifted ? "0.1em" : "0",
          textTransform: lifted ? "uppercase" : "none",
          transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
          fontFamily: "'Jost', sans-serif",
          zIndex: 1,
        }}>
          {label}
        </label>

        {/* Icon */}
        <div style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          color: focused ? "#4a7c59" : "#b0a090", transition: "color 0.2s", fontSize: 13,
        }}>
          <Icon />
        </div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", background: "transparent", border: "none", outline: "none",
            padding: lifted ? "22px 44px 8px 44px" : "16px 44px 16px 44px",
            fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", color: "#2d1f0e",
            transition: "padding 0.22s ease",
            boxSizing: "border-box",
          }}
          autoComplete={isPw ? "current-password" : "email"}
        />

        {/* Show/hide password */}
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#a09080", cursor: "pointer",
              padding: 4, display: "flex", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#4a7c59"}
            onMouseLeave={e => e.currentTarget.style.color = "#a09080"}
          >
            {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>
      {error && <p style={{ color: "#c0392b", fontSize: "0.75rem", margin: "4px 0 16px 4px", fontFamily: "'Jost', sans-serif" }}>{error}</p>}
    </div>
  );
};

/* ── Main ── */
const LoginPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(s => s.auth);

  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors]     = useState({});
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);
  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!formData.email)                        e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password)                     e.password = "Password is required";
    else if (formData.password.length < 6)      e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) dispatch(login({ email: formData.email, password: formData.password }));
  };

  const SLIDES = [
    { headline: "Farm to Table,", italic: "Direct.", sub: "Connect with local farmers and get the freshest produce delivered straight to you." },
    { headline: "Know Your", italic: "Farmer.", sub: "Every product has a story. Meet the hands that grow your food." },
    { headline: "Seasonal,", italic: "Sustainable.", sub: "Fresh harvests, zero middlemen. Better for you, better for the planet." },
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ── LEFT PANEL ── */
        .lp-left {
          position: relative;
          background: linear-gradient(160deg, #1a3020 0%, #2d5a3d 40%, #1e3a27 70%, #152a1c 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
          padding: 110px 48px 60px;
        }

        /* Grain texture */
        .lp-left::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.035;
          pointer-events: none;
          z-index: 1;
        }

        /* Radial spotlight */
        .lp-spotlight {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,124,89,0.22) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: lp-breathe 6s ease-in-out infinite;
        }
        @keyframes lp-breathe {
          0%,100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50%      { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }

        .lp-left-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 420px;
        }

        /* Logo */
        .lp-brand {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 64px;
          animation: lp-fadeUp 0.7s ease both 0.1s;
        }
        .lp-brand-icon {
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: #a8d5b5; font-size: 18px;
          backdrop-filter: blur(8px);
        }
        .lp-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 700;
          color: #e8d5b0; letter-spacing: 0.02em;
        }
        .lp-brand-name em { font-style: normal; color: #7db894; }

        /* Slide headline */
        .lp-slide {
          min-height: 160px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .lp-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          font-weight: 700;
          color: #e8d5b0;
          line-height: 1.15;
          margin-bottom: 6px;
          animation: lp-fadeUp 0.6s ease both;
        }
        .lp-headline-italic {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          font-weight: 600;
          font-style: italic;
          background: linear-gradient(90deg, #7db894, #a8d5b5, #7db894);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lp-shimmer 3s linear infinite, lp-fadeUp 0.6s ease both 0.1s;
          display: block; margin-bottom: 20px;
        }
        @keyframes lp-shimmer { 0%{background-position:0%} 100%{background-position:200%} }

        .lp-sub {
          color: rgba(232,213,176,0.55);
          font-size: 0.92rem; font-weight: 300;
          line-height: 1.75; max-width: 340px;
          margin: 0 auto;
          animation: lp-fadeUp 0.6s ease both 0.2s;
        }

        /* Slide dots */
        .lp-dots {
          display: flex; gap: 8px;
          justify-content: center;
          margin-top: 44px;
          animation: lp-fadeUp 0.6s ease both 0.4s;
        }
        .lp-dot {
          height: 6px; border-radius: 3px;
          background: rgba(125,184,148,0.3);
          transition: all 0.4s ease; cursor: pointer;
        }
        .lp-dot.active { background: #7db894; width: 22px; }
        .lp-dot:not(.active) { width: 6px; }
        .lp-dot:not(.active):hover { background: rgba(125,184,148,0.55); }

        /* Decorative bottom strip */
        .lp-strip {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(125,184,148,0.5), rgba(232,213,176,0.3), rgba(125,184,148,0.5), transparent);
          animation: lp-stripMove 4s linear infinite;
        }
        @keyframes lp-stripMove { 0%{background-position:0%} 100%{background-position:200%} }

        @keyframes lp-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── RIGHT PANEL ── */
        .lp-right {
          background: #f8f3eb;
          display: flex; align-items: center; justify-content: center;
          padding: 60px 48px;
          padding-top: 110px;
          position: relative;
        }

        /* Subtle texture on right */
        .lp-right::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 90% 10%, rgba(74,124,89,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 10% 90%, rgba(139,105,20,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .lp-form-wrap {
          width: 100%; max-width: 420px;
          position: relative;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .lp-form-wrap.visible {
          opacity: 1; transform: translateY(0);
        }

        /* Header */
        .lp-form-eyebrow {
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #4a7c59; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .lp-form-eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px; height: 1.5px;
          background: #4a7c59; border-radius: 2px;
        }

        .lp-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700; color: #1a1208;
          line-height: 1.15; margin-bottom: 8px;
        }

        .lp-form-sub {
          font-size: 0.875rem; color: #8a7a65;
          font-weight: 300; margin-bottom: 40px;
        }
        .lp-form-sub a {
          color: #4a7c59; font-weight: 600;
          text-decoration: none; border-bottom: 1px solid rgba(74,124,89,0.3);
          padding-bottom: 1px; transition: border-color 0.2s;
        }
        .lp-form-sub a:hover { border-color: #4a7c59; }

        /* Server error */
        .lp-error-banner {
          background: rgba(192,57,43,0.07);
          border: 1px solid rgba(192,57,43,0.2);
          border-radius: 12px;
          padding: 12px 16px;
          color: #c0392b;
          font-size: 0.84rem;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }

        /* Remember + forgot */
        .lp-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .lp-remember {
          display: flex; align-items: center; gap: 8px;
          cursor: pointer; user-select: none;
        }
        .lp-checkbox {
          width: 17px; height: 17px;
          border: 1.5px solid rgba(101,78,51,0.25);
          border-radius: 5px; background: #f5ede0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; flex-shrink: 0;
        }
        .lp-checkbox.checked {
          background: #4a7c59; border-color: #4a7c59;
        }
        .lp-checkbox.checked::after {
          content: '✓'; color: white; font-size: 10px; font-weight: 700;
        }
        .lp-remember-text {
          font-size: 0.84rem; color: #6a5a48; font-weight: 400;
        }
        .lp-forgot {
          font-size: 0.84rem; color: #4a7c59; font-weight: 500;
          text-decoration: none; transition: color 0.2s;
        }
        .lp-forgot:hover { color: #2d5a3d; }

        /* Submit button */
        .lp-submit {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #2d5a3d, #1a3020);
          color: #e8d5b0;
          border: none; border-radius: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s cubic-bezier(0.34,1.4,0.64,1);
          box-shadow: 0 4px 20px rgba(29,58,39,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
          position: relative; overflow: hidden;
        }
        .lp-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .lp-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(29,58,39,0.45), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
        .lp-submit:hover::before { opacity: 1; }
        .lp-submit:active { transform: translateY(0); }
        .lp-submit:disabled {
          opacity: 0.7; cursor: not-allowed; transform: none;
        }

        /* Loading spinner */
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(232,213,176,0.3);
          border-top-color: #e8d5b0;
          border-radius: 50%;
          animation: lp-spin 0.7s linear infinite;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }

        /* Divider */
        .lp-divider {
          display: flex; align-items: center; gap: 14px;
          margin: 28px 0;
        }
        .lp-divider-line {
          flex: 1; height: 1px;
          background: rgba(101,78,51,0.12);
        }
        .lp-divider-text {
          font-size: 0.75rem; color: #a09080;
          font-weight: 400; letter-spacing: 0.06em;
          white-space: nowrap;
        }

        /* Register link */
        .lp-register {
          text-align: center;
          font-size: 0.875rem; color: #8a7a65; font-weight: 300;
        }
        .lp-register a {
          color: #4a7c59; font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid rgba(74,124,89,0.3); padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .lp-register a:hover { border-color: #4a7c59; }

        /* Decorative corner element */
        .lp-corner {
          position: absolute;
          width: 120px; height: 120px;
          pointer-events: none; opacity: 0.07;
        }
        .lp-corner-tl { top: 0; left: 0; }
        .lp-corner-br { bottom: 0; right: 0; transform: rotate(180deg); }

        @media (max-width: 768px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-left { display: none; }
          .lp-right { padding: 40px 24px; align-items: flex-start; padding-top: 110px; }
        }
      `}</style>

      <div className="lp-root">

        {/* ── LEFT ── */}
        <div className="lp-left">
          <BotanicalCanvas />
          <div className="lp-spotlight" />

          <div className="lp-left-content">
            {/* Brand */}
            <div className="lp-brand">
              <div className="lp-brand-icon"><FaLeaf /></div>
              <span className="lp-brand-name">Krishi<em>Sahayi</em></span>
            </div>

            {/* Cycling slide */}
            <div className="lp-slide" key={slide}>
              <h1 className="lp-headline">{SLIDES[slide].headline}</h1>
              <span className="lp-headline-italic">{SLIDES[slide].italic}</span>
              <p className="lp-sub">{SLIDES[slide].sub}</p>
            </div>

            {/* Dots */}
            <div className="lp-dots">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`lp-dot ${i === slide ? "active" : ""}`}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </div>

          <div className="lp-strip" />
        </div>

        {/* ── RIGHT ── */}
        <div className="lp-right">
          {/* Decorative corners */}
          <svg className="lp-corner lp-corner-tl" viewBox="0 0 120 120" fill="none">
            <path d="M0 120 Q0 0 120 0" stroke="#4a7c59" strokeWidth="1.5" fill="none"/>
            <circle cx="10" cy="10" r="3" fill="#4a7c59"/>
          </svg>
          <svg className="lp-corner lp-corner-br" viewBox="0 0 120 120" fill="none">
            <path d="M0 120 Q0 0 120 0" stroke="#4a7c59" strokeWidth="1.5" fill="none"/>
            <circle cx="10" cy="10" r="3" fill="#4a7c59"/>
          </svg>

          <div className={`lp-form-wrap ${mounted ? "visible" : ""}`}>
            {/* Header */}
            <div className="lp-form-eyebrow">Welcome back</div>
            <h2 className="lp-form-title">Sign in to<br />your account</h2>
            <p className="lp-form-sub">
              New here? <Link to="/register">Create an account</Link>
            </p>

            {/* Server error */}
            {error && (
              <div className="lp-error-banner">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <FloatingInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                icon={FaEnvelope}
                error={errors.email}
              />

              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                icon={FaLock}
                error={errors.password}
              />

              <div className="lp-row">
                <label
                  className="lp-remember"
                  onClick={() => setFormData(p => ({ ...p, remember: !p.remember }))}
                >
                  <div className={`lp-checkbox ${formData.remember ? "checked" : ""}`} />
                  <span className="lp-remember-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="lp-forgot">Forgot password?</Link>
              </div>

              <button type="submit" className="lp-submit" disabled={loading}>
                {loading ? (
                  <><div className="lp-spinner" /> Signing in…</>
                ) : (
                  <>Sign In <FaArrowRight size={13} /></>
                )}
              </button>
            </form>

            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or</span>
              <div className="lp-divider-line" />
            </div>

            <p className="lp-register">
              Don't have an account? <Link to="/register">Join KrishiSahayi</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;