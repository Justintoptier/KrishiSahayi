import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaUsers, FaHandshake, FaShoppingBasket, FaCheck } from "react-icons/fa";
import { member1, member2, member3 } from "../assets";

/* ─── Scroll-reveal hook ─────────────────────────────────────────────────── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

/* ─── Counter animation ─────────────────────────────────────────────────── */
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(start));
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const teamMembers = [
  { id: 1, name: "Justin Juby", pic: member1, linkedin: "https://www.linkedin.com/in/justinjuby/" },
  { id: 2, name: "Sagnik Roy Chowdhury",  pic: member2, linkedin: "https://www.linkedin.com/in/s-r-chowdhury/" },
  { id: 3, name: "Franklin Babu", pic: member3, linkedin: "https://www.linkedin.com/in/franklin-babu-852022327/" },
];

const AboutPage = () => {
  useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        /* ══════════════════════════════════════════
           TOKENS
        ══════════════════════════════════════════ */
        :root {
          --ink:    #0e1a0f;
          --paper:  #f4f0e8;
          --sage:   #4a7c59;
          --moss:   #2d5a3d;
          --mist:   #a8c5b0;
          --gold:   #c9a84c;
          --cream:  #e8d5a3;
          --warm:   #8a7a65;
        }

        /* ══════════════════════════════════════════
           BASE
        ══════════════════════════════════════════ */
        .ab-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--paper);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ══════════════════════════════════════════
           REVEAL SYSTEM
        ══════════════════════════════════════════ */
        [data-reveal] {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal="left"]  { transform: translateX(-50px); }
        [data-reveal="right"] { transform: translateX(50px); }
        [data-reveal="scale"] { transform: scale(0.92); }
        [data-reveal].revealed { opacity: 1 !important; transform: none !important; }
        [data-delay="1"] { transition-delay: 0.1s; }
        [data-delay="2"] { transition-delay: 0.2s; }
        [data-delay="3"] { transition-delay: 0.3s; }
        [data-delay="4"] { transition-delay: 0.4s; }
        [data-delay="5"] { transition-delay: 0.5s; }
        [data-delay="6"] { transition-delay: 0.6s; }

        /* ══════════════════════════════════════════
           ① HERO — cinematic full-bleed
        ══════════════════════════════════════════ */
        .ab-hero {
          min-height: 100vh;
          background: var(--ink);
          display: grid;
          grid-template-rows: 1fr auto;
          position: relative;
          overflow: hidden;
          padding-top: 72px;
        }

        /* Grain texture overlay */
        .ab-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.5;
        }

        /* Big decorative leaf watermark */
        .ab-hero-watermark {
          position: absolute;
          right: -8vw; bottom: -10vh;
          width: 55vw; max-width: 700px;
          opacity: 0.04;
          color: var(--mist);
          pointer-events: none; z-index: 0;
        }

        /* Ambient glow blobs */
        .ab-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .ab-blob-1 { width: 500px; height: 500px; background: rgba(74,124,89,0.15); top: -100px; left: -150px; }
        .ab-blob-2 { width: 350px; height: 350px; background: rgba(201,168,76,0.08); bottom: 0; right: 10%; }

        .ab-hero-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 2rem 4rem;
          position: relative; z-index: 2;
        }

        .ab-kicker {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--mist); margin-bottom: 2rem;
          border: 1px solid rgba(168,197,176,0.2);
          padding: 6px 16px; border-radius: 100px;
          background: rgba(74,124,89,0.08);
          animation: fade-up 0.8s 0.2s both;
        }

        @keyframes fade-up {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: none; }
        }

        .ab-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 10vw, 8rem);
          font-weight: 900;
          line-height: 0.95;
          color: var(--cream);
          margin-bottom: 0.15em;
          animation: fade-up 0.9s 0.35s both;
        }

        .ab-hero-title-em {
          display: block;
          font-style: italic;
          font-weight: 400;
          color: var(--mist);
          font-size: 0.65em;
        }

        .ab-hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(168,197,176,0.7);
          font-weight: 300;
          line-height: 1.7;
          max-width: 500px;
          margin: 2rem auto 3rem;
          animation: fade-up 0.9s 0.5s both;
        }

        .ab-hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          animation: fade-up 0.9s 0.65s both;
        }

        .ab-btn-fill {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--sage); color: var(--cream);
          border-radius: 10px; padding: 13px 28px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
          text-decoration: none; transition: all 0.25s; border: none; cursor: pointer;
          letter-spacing: 0.02em;
        }
        .ab-btn-fill:hover { background: var(--moss); box-shadow: 0 6px 24px rgba(45,90,61,0.4); transform: translateY(-2px); }

        .ab-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(168,197,176,0.25); color: var(--mist);
          border-radius: 10px; padding: 12px 24px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 400;
          text-decoration: none; transition: all 0.2s; background: transparent;
        }
        .ab-btn-ghost:hover { border-color: var(--mist); color: var(--cream); background: rgba(168,197,176,0.06); }

        /* Scroll hint */
        .ab-hero-scroll {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 2rem; color: rgba(168,197,176,0.35);
          font-family: 'DM Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          position: relative; z-index: 2;
          animation: fade-up 1s 1s both;
        }

        .ab-scroll-line {
          width: 1px; height: 50px;
          background: linear-gradient(to bottom, rgba(168,197,176,0.4), transparent);
          animation: scroll-pulse 2s infinite;
        }

        @keyframes scroll-pulse {
          0%,100% { transform: scaleY(1); opacity: 0.4; }
          50%      { transform: scaleY(0.6); opacity: 0.15; }
        }

        /* ══════════════════════════════════════════
           ② STATS TICKER BAND
        ══════════════════════════════════════════ */
        .ab-ticker {
          background: var(--sage);
          overflow: hidden;
          padding: 18px 0;
          position: relative;
        }

        .ab-ticker-track {
          display: flex;
          gap: 0;
          animation: ticker-scroll 25s linear infinite;
          white-space: nowrap;
          width: max-content;
        }

        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .ab-ticker-item {
          display: inline-flex; align-items: center; gap: 14px;
          padding: 0 40px;
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(232,213,163,0.85);
        }

        .ab-ticker-dot { width: 4px; height: 4px; background: var(--gold); border-radius: 50%; flex-shrink: 0; }

        /* ══════════════════════════════════════════
           ③ MISSION — editorial split layout
        ══════════════════════════════════════════ */
        .ab-mission-wrap {
          background: var(--ink);
          position: relative;
          overflow: hidden;
          padding: 120px 0;
        }

        .ab-mission-wrap::after {
          content: 'MISSION';
          position: absolute;
          bottom: -40px; left: -20px;
          font-family: 'Playfair Display', serif;
          font-size: 18vw; font-weight: 900;
          color: rgba(168,197,176,0.025);
          pointer-events: none; line-height: 1;
          letter-spacing: -0.05em;
        }

        .ab-mission-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 4rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: center; position: relative; z-index: 1;
        }

        .ab-mission-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--sage); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .ab-mission-label::after { content: ''; flex: 1; height: 1px; background: rgba(74,124,89,0.3); max-width: 60px; }

        .ab-mission-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 900; color: var(--cream);
          line-height: 1.1; margin-bottom: 28px;
        }
        .ab-mission-title em { font-style: italic; color: var(--mist); font-weight: 400; }

        .ab-mission-body {
          color: rgba(168,197,176,0.6);
          font-size: 0.95rem; font-weight: 300;
          line-height: 1.9;
        }
        .ab-mission-body p + p { margin-top: 16px; }

        /* Right side — big stat cards */
        .ab-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .ab-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(168,197,176,0.08);
          border-radius: 16px; padding: 28px 24px;
          transition: border-color 0.3s, background 0.3s;
        }
        .ab-stat-card:hover { border-color: rgba(74,124,89,0.3); background: rgba(74,124,89,0.05); }

        .ab-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem; font-weight: 900;
          color: var(--cream); line-height: 1;
          margin-bottom: 6px;
        }
        .ab-stat-num span { color: var(--sage); }

        .ab-stat-label {
          font-size: 0.78rem; font-weight: 300;
          color: rgba(168,197,176,0.5);
          letter-spacing: 0.05em;
        }

        /* ══════════════════════════════════════════
           ④ HOW IT WORKS — horizontal process
        ══════════════════════════════════════════ */
        .ab-how-wrap { padding: 120px 0; background: var(--paper); }
        .ab-how-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }

        .ab-section-header { text-align: center; margin-bottom: 64px; }

        .ab-section-kicker {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--sage); margin-bottom: 12px;
          display: block;
        }

        .ab-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900; color: var(--ink); line-height: 1.1;
        }
        .ab-section-title em { font-style: italic; color: var(--sage); }

        .ab-process-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; position: relative;
        }

        /* connector line */
        .ab-process-row::before {
          content: '';
          position: absolute;
          top: 40px; left: calc(16.66% + 20px); right: calc(16.66% + 20px);
          height: 1px;
          background: linear-gradient(90deg, var(--sage), rgba(74,124,89,0.2), var(--sage));
        }

        .ab-process-step {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 0 32px;
          position: relative;
        }

        .ab-process-num {
          width: 80px; height: 80px;
          background: var(--ink);
          border: 2px solid var(--sage);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px; position: relative; z-index: 1;
          transition: all 0.3s;
        }
        .ab-process-step:hover .ab-process-num {
          background: var(--sage);
          box-shadow: 0 0 0 8px rgba(74,124,89,0.1);
          transform: scale(1.08);
        }

        .ab-process-num-inner {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 900;
          color: var(--sage);
          transition: color 0.3s;
        }
        .ab-process-step:hover .ab-process-num-inner { color: var(--cream); }

        .ab-process-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--sage);
          margin-bottom: 10px;
        }

        .ab-process-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700;
          color: var(--ink); margin-bottom: 12px;
        }

        .ab-process-body {
          font-size: 0.86rem; color: var(--warm);
          font-weight: 300; line-height: 1.75;
        }

        /* ══════════════════════════════════════════
           ⑤ BENEFITS — dark asymmetric layout
        ══════════════════════════════════════════ */
        .ab-benefits-wrap {
          background: var(--ink);
          padding: 120px 0; position: relative; overflow: hidden;
        }

        .ab-benefits-wrap::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,124,89,0.4), transparent);
        }

        .ab-benefits-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 4rem;
        }

        .ab-benefits-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px; border: 1px solid rgba(168,197,176,0.06);
          border-radius: 24px; overflow: hidden; margin-top: 64px;
        }

        .ab-benefit-panel {
          padding: 52px 48px;
          background: rgba(255,255,255,0.02);
          transition: background 0.3s;
          position: relative;
        }
        .ab-benefit-panel:hover { background: rgba(74,124,89,0.04); }
        .ab-benefit-panel + .ab-benefit-panel {
          border-left: 1px solid rgba(168,197,176,0.06);
        }

        .ab-benefit-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--sage); margin-bottom: 8px; display: block;
        }

        .ab-benefit-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; font-weight: 900; italic;
          color: var(--cream); margin-bottom: 36px; line-height: 1.1;
        }

        .ab-benefit-list { display: flex; flex-direction: column; gap: 0; }

        .ab-benefit-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(168,197,176,0.06);
          transition: all 0.2s;
        }
        .ab-benefit-row:last-child { border-bottom: none; }
        .ab-benefit-row:hover { padding-left: 4px; }

        .ab-benefit-icon {
          width: 20px; height: 20px; flex-shrink: 0;
          background: rgba(74,124,89,0.15); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: var(--sage); margin-top: 1px;
        }

        .ab-benefit-text {
          font-size: 0.88rem; color: rgba(168,197,176,0.65);
          font-weight: 300; line-height: 1.6;
        }

        /* ══════════════════════════════════════════
           ⑥ TEAM — magazine portrait layout
        ══════════════════════════════════════════ */
        .ab-team-wrap { padding: 120px 0; background: var(--paper); }
        .ab-team-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }

        .ab-team-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; margin-top: 64px;
        }

        .ab-team-card {
          position: relative; overflow: hidden;
          border-radius: 20px; cursor: default;
          background: var(--ink);
          aspect-ratio: 3/4;
        }

        .ab-team-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
          filter: grayscale(20%);
        }
        .ab-team-card:hover .ab-team-img { transform: scale(1.05); filter: grayscale(0%); }

        /* Dark gradient overlay */
        .ab-team-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(14,26,15,0.96) 0%, rgba(14,26,15,0.4) 50%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 32px 28px;
          transition: background 0.3s;
        }

        .ab-team-role {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--sage); margin-bottom: 6px;
        }

        .ab-team-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem; font-weight: 700;
          color: var(--cream); margin-bottom: 16px; line-height: 1.15;
        }

        .ab-team-linkedin {
          display: inline-flex; align-items: center; gap: 7px;
          color: rgba(168,197,176,0.6); font-size: 0.78rem; font-weight: 400;
          text-decoration: none; transition: color 0.2s;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.3s, transform 0.3s, color 0.2s;
        }
        .ab-team-card:hover .ab-team-linkedin { opacity: 1; transform: none; }
        .ab-team-linkedin:hover { color: var(--mist); }

        /* ══════════════════════════════════════════
           ⑦ CTA — full bleed dramatic close
        ══════════════════════════════════════════ */
        .ab-cta-wrap {
          background: var(--ink);
          padding: 0;
          position: relative; overflow: hidden;
        }

        .ab-cta-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 30% 50%, rgba(74,124,89,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 50%, rgba(201,168,76,0.06) 0%, transparent 55%);
        }

        .ab-cta-inner {
          max-width: 900px; margin: 0 auto; padding: 140px 4rem;
          text-align: center; position: relative; z-index: 1;
        }

        .ab-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight: 900; color: var(--cream);
          line-height: 1.05; margin-bottom: 24px;
        }
        .ab-cta-title em { font-style: italic; color: var(--mist); font-weight: 400; }

        .ab-cta-sub {
          font-size: 1rem; color: rgba(168,197,176,0.55);
          font-weight: 300; max-width: 460px;
          margin: 0 auto 48px; line-height: 1.8;
        }

        .ab-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        .ab-cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--cream); color: var(--ink);
          border-radius: 10px; padding: 14px 32px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
          text-decoration: none; transition: all 0.25s; letter-spacing: 0.01em;
        }
        .ab-cta-primary:hover { background: #f8f0dc; box-shadow: 0 6px 24px rgba(0,0,0,0.25); transform: translateY(-2px); }

        .ab-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(168,197,176,0.2); color: rgba(168,197,176,0.7);
          border-radius: 10px; padding: 13px 28px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 400;
          text-decoration: none; transition: all 0.2s; background: transparent;
        }
        .ab-cta-ghost:hover { border-color: rgba(168,197,176,0.5); color: var(--cream); }

        /* Divider line */
        .ab-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,124,89,0.3), transparent);
          margin: 0;
        }

        /* ══════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════ */
        @media (max-width: 900px) {
          .ab-mission-inner { grid-template-columns: 1fr; gap: 48px; padding: 0 2rem; }
          .ab-how-inner, .ab-benefits-inner, .ab-team-inner, .ab-cta-inner { padding: 0 2rem; }
          .ab-process-row { grid-template-columns: 1fr; }
          .ab-process-row::before { display: none; }
          .ab-benefits-grid { grid-template-columns: 1fr; }
          .ab-benefit-panel + .ab-benefit-panel { border-left: none; border-top: 1px solid rgba(168,197,176,0.06); }
          .ab-team-grid { grid-template-columns: 1fr; }
          .ab-team-card { aspect-ratio: 4/3; }
        }
      `}</style>

      <div className="ab-root">

        {/* ① HERO */}
        <section className="ab-hero">
          <div className="ab-blob ab-blob-1" />
          <div className="ab-blob ab-blob-2" />
          <svg className="ab-hero-watermark" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2z"/>
          </svg>

          <div className="ab-hero-body">
            <div className="ab-kicker"><FaLeaf size={9} /> Est. 2026 · KrishiSahayi</div>
            <h1 className="ab-hero-title">
              About
              <em className="ab-hero-title-em">KrishiSahayi</em>
            </h1>
            <p className="ab-hero-sub">
              We exist to close the distance between the hands that grow food
              and the hands that eat it — building a fairer, greener food system.
            </p>
            <div className="ab-hero-ctas">
              <Link to="/products" className="ab-btn-fill"><FaShoppingBasket size={13} /> Browse Products</Link>
              <Link to="/farmers" className="ab-btn-ghost"><FaUsers size={13} /> Meet Farmers</Link>
            </div>
          </div>

          <div className="ab-hero-scroll">
            <div className="ab-scroll-line" />
            scroll
          </div>
        </section>

        {/* TICKER */}
        <div className="ab-ticker">
          <div className="ab-ticker-track">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ display: "inline-flex" }}>
                {["Farm to Table", "Zero Middlemen", "Fresh & Local", "100% Transparent", "Sustainable Farming", "Direct Trade", "Community First", "Organic Produce"].map((t, j) => (
                  <span key={j} className="ab-ticker-item">
                    <span className="ab-ticker-dot" /> {t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ② MISSION */}
        <section className="ab-mission-wrap">
          <div className="ab-mission-inner">
            <div>
              <div className="ab-mission-label" data-reveal="left"><FaLeaf size={10} /> Our Mission</div>
              <h2 className="ab-mission-title" data-reveal="left" data-delay="1">
                Bridging<br /><em>Farm & Fork</em>
              </h2>
              <div className="ab-mission-body" data-reveal="left" data-delay="2">
                <p>KrishiSahayi was built on a simple conviction: the people who grow our food deserve to thrive, and the people who eat it deserve to know where it comes from.</p>
                <p>By cutting out intermediaries and building a transparent marketplace, we're constructing a food system that is accountable to farmers and consumers alike — reducing waste, carbon miles, and exploitation at every step.</p>
              </div>
            </div>

            <div className="ab-stat-grid" data-reveal="right">
              {[
                { num: 5, suffix: "+", label: "Farmers onboarded" },
                { num: 2, suffix: "+", label: "Happy consumers" },
                { num: 98, suffix: "%", label: "Fresh quality rate" },
                { num: 40, suffix: "%", label: "Higher farmer income" },
              ].map((s, i) => (
                <div key={i} className="ab-stat-card" data-delay={String(i + 1)}>
                  <div className="ab-stat-num">
                    <Counter target={s.num} suffix={s.suffix} />
                  </div>
                  <div className="ab-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="ab-divider" />

        {/* ③ HOW IT WORKS */}
        <section className="ab-how-wrap">
          <div className="ab-how-inner">
            <div className="ab-section-header" data-reveal>
              <span className="ab-section-kicker">The process</span>
              <h2 className="ab-section-title">How It <em>Works</em></h2>
            </div>

            <div className="ab-process-row">
              {[
                { n: "01", label: "Discover", title: "Connect", body: "Farmers create rich profiles showcasing their land, practices, and produce. Consumers find farms within their community.", icon: <FaUsers size={22} /> },
                { n: "02", label: "Purchase", title: "Order", body: "Browse seasonal products, select what you need, and place orders directly with the farmer. No apps, no middlemen.", icon: <FaShoppingBasket size={22} /> },
                { n: "03", label: "Receive", title: "Enjoy", body: "Fresh produce arrives from the source. Build real relationships with the people who grow your food, season after season.", icon: <FaHandshake size={22} /> },
              ].map((step, i) => (
                <div key={i} className="ab-process-step" data-reveal data-delay={String(i + 1)}>
                  <div className="ab-process-num">
                    <span className="ab-process-num-inner">{step.n}</span>
                  </div>
                  <div className="ab-process-label">{step.label}</div>
                  <h3 className="ab-process-title">{step.title}</h3>
                  <p className="ab-process-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ④ BENEFITS */}
        <section className="ab-benefits-wrap">
          <div className="ab-benefits-inner">
            <div className="ab-section-header" data-reveal>
              <span className="ab-section-kicker" style={{ color: "var(--mist)" }}>Why it matters</span>
              <h2 className="ab-section-title" style={{ color: "var(--cream)" }}>The <em>Benefits</em></h2>
            </div>

            <div className="ab-benefits-grid">
              {[
                {
                  side: "Consumers",
                  items: ["Access to fresher, more nutritious produce", "Full transparency on where your food comes from", "Support local farmers and sustainable practices", "Shorter supply chains mean lower carbon footprint", "Direct line of communication with your farmer"],
                },
                {
                  side: "Farmers",
                  items: ["Higher margins by selling direct to consumers", "Stable local demand for seasonal produce", "Reduced post-harvest waste through better planning", "Platform to tell your story and grow your brand", "Real feedback from the people eating your food"],
                },
              ].map((panel, i) => (
                <div key={i} className="ab-benefit-panel" data-reveal={i === 0 ? "left" : "right"} data-delay="1">
                  <span className="ab-benefit-eyebrow">For {panel.side}</span>
                  <h3 className="ab-benefit-heading">{panel.side}</h3>
                  <div className="ab-benefit-list">
                    {panel.items.map((item, j) => (
                      <div key={j} className="ab-benefit-row">
                        <div className="ab-benefit-icon"><FaCheck size={9} /></div>
                        <span className="ab-benefit-text">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑤ TEAM */}
        <section className="ab-team-wrap">
          <div className="ab-team-inner">
            <div className="ab-section-header" data-reveal>
              <span className="ab-section-kicker">The people</span>
              <h2 className="ab-section-title">Meet the <em>Team</em></h2>
            </div>

            <div className="ab-team-grid">
              {teamMembers.map((m, i) => (
                <div key={m.id} className="ab-team-card" data-reveal data-delay={String(i + 1)}>
                  <img src={m.pic} alt={m.name} className="ab-team-img" />
                  <div className="ab-team-overlay">
                    <div className="ab-team-role">{m.role}</div>
                    <div className="ab-team-name">{m.name}</div>
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="ab-team-linkedin">
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                      </svg>
                      View LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑥ CTA */}
        <section className="ab-cta-wrap">
          <div className="ab-cta-bg" />
          <div className="ab-cta-inner">
            <h2 className="ab-cta-title" data-reveal>
              Join Our<br /><em>Community</em>
            </h2>
            <p className="ab-cta-sub" data-reveal data-delay="1">
              Whether you grow it or eat it — KrishiSahayi is the platform that brings the farm to your table.
            </p>
            <div className="ab-cta-btns" data-reveal data-delay="2">
              <Link to="/register" className="ab-cta-primary">Sign Up Free</Link>
              <Link to="/products" className="ab-cta-ghost">Browse Products</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default AboutPage;
