"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import { SkeletonGrid } from "../components/SkeletonLoader";
import { ScrollReveal, StaggerReveal, CountUp } from "../components/ScrollReveal";
import { MarqueeStrip } from "../components/MarqueeStrip";
import { FaLeaf, FaUsers, FaShoppingBasket, FaHandshake, FaArrowRight } from "react-icons/fa";

/* ═══════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════ */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --ink:   #0b1a0d;
    --paper: #f2ede3;
    --sage:  #4a7c59;
    --moss:  #2d5a3d;
    --mist:  #9dc4aa;
    --gold:  #c9a84c;
    --cream: #e8d5a3;
    --warm:  #7a6a55;
    --white: #fdfaf4;
  }

  /* ── Reset / base ── */
  .hp-root { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); overflow-x: hidden; }

  /* ════════════════════════════════════
     HERO — full cinematic bleed
  ════════════════════════════════════ */
  .hp-hero {
    position: relative;
    height: 100vh; min-height: 680px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }

  .hp-hero-bg {
    position: absolute; inset: -8%;
    background-image: url('/farm-hero.png');
    background-size: cover; background-position: center;
    transition: transform 0.12s ease-out;
    will-change: transform; z-index: 0;
  }

  /* Dual-tone cinematic overlay */
  .hp-hero-overlay {
    position: absolute; inset: 0; z-index: 1;
    background:
      linear-gradient(180deg,
        rgba(11,26,13,0.82) 0%,
        rgba(11,26,13,0.45) 40%,
        rgba(11,26,13,0.72) 100%
      );
  }

  .hp-hero-grain {
    position: absolute; inset: 0; z-index: 2; opacity: 0.055; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Vignette that breathes */
  .hp-hero-vignette {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: radial-gradient(ellipse at 50% 40%, transparent 28%, rgba(0,0,0,0.7) 100%);
    animation: breathe 8s ease-in-out infinite;
  }
  @keyframes breathe { 0%,100%{opacity:.7} 50%{opacity:1} }

  .hp-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; }

  /* Hero typography */
  .hp-hero-content { position: relative; z-index: 10; text-align: center; width: 100%; padding: 0 2rem; }
  .hp-hero-inner { max-width: 900px; margin: 0 auto; }

  .hp-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.07); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.14); color: var(--mist);
    border-radius: 100px; padding: 8px 22px;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 32px;
    animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }
  .hp-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
    animation: pulse-g 2s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(74,222,128,0.6);
  }
  @keyframes pulse-g { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

  .hp-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.2rem, 9vw, 7.5rem);
    font-weight: 900;
    color: var(--cream);
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin-bottom: 30px;
    text-shadow: 0 8px 60px rgba(0,0,0,0.5);
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.25s both;
  }

  .hp-headline-line2 {
    display: block;
    font-style: italic;
    font-weight: 400;
    font-size: 0.7em;
    background: linear-gradient(110deg, var(--mist) 0%, #c8e8d4 40%, var(--mist) 80%);
    background-size: 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.35s both,
               shimmer 5s linear 1.5s infinite;
  }
  @keyframes shimmer { 0%{background-position:0%} 100%{background-position:200%} }

  .hp-sub {
    font-size: clamp(0.95rem, 1.8vw, 1.15rem);
    font-weight: 300;
    color: rgba(232,213,163,0.7);
    line-height: 1.75;
    max-width: 500px;
    margin: 0 auto 44px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.45s both;
  }

  .hp-ctas {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both;
  }

  .hp-cta-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, var(--sage), var(--moss));
    color: var(--cream); border-radius: 12px; padding: 15px 34px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
    text-decoration: none; transition: all 0.28s;
    box-shadow: 0 8px 32px rgba(45,90,61,0.5);
    letter-spacing: 0.01em;
  }
  .hp-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 44px rgba(45,90,61,0.55); }

  .hp-cta-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
    color: var(--cream); border: 1px solid rgba(232,213,163,0.25);
    border-radius: 12px; padding: 14px 28px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 400;
    text-decoration: none; transition: all 0.25s;
  }
  .hp-cta-secondary:hover { border-color: rgba(232,213,163,0.5); background: rgba(232,213,163,0.1); transform: translateY(-2px); }

  /* Scroll indicator */
  .hp-scroll {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: rgba(157,196,170,0.4); z-index: 10;
    font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 0.18em;
    text-transform: uppercase;
    animation: fadeUp 1s ease 1.4s both;
  }
  .hp-scroll-line {
    width: 1px; height: 52px;
    background: linear-gradient(to bottom, rgba(157,196,170,0.5), transparent);
    animation: drip 2.2s ease-in-out infinite;
  }
  @keyframes drip {
    0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
    45%  { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }

  /* ════════════════════════════════════
     STATS BAR
  ════════════════════════════════════ */
  .hp-stats {
    background: var(--moss);
    position: relative; overflow: hidden;
  }
  .hp-stats::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(74,124,89,0.4) 0%, transparent 70%);
  }
  .hp-stats-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4,1fr);
    position: relative; z-index: 1;
  }
  .hp-stat {
    padding: 36px 24px; text-align: center;
    border-right: 1px solid rgba(157,196,170,0.12);
    transition: background 0.3s;
  }
  .hp-stat:last-child { border-right: none; }
  .hp-stat:hover { background: rgba(74,124,89,0.15); }
  .hp-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem; font-weight: 900;
    color: var(--cream); line-height: 1; margin-bottom: 6px;
  }
  .hp-stat-num em { font-style: normal; color: #7de8a0; }
  .hp-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; color: rgba(157,196,170,0.6);
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ════════════════════════════════════
     SECTION SCAFFOLDING
  ════════════════════════════════════ */
  .hp-section { padding: 110px 2rem; }
  .hp-section.light  { background: var(--white); }
  .hp-section.beige  { background: var(--paper); }
  .hp-section.dark   { background: var(--ink); }

  .hp-section-inner { max-width: 1200px; margin: 0 auto; }

  .hp-kicker {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--sage); margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .hp-kicker::after { content: ''; flex: 0 0 40px; height: 1px; background: rgba(74,124,89,0.35); }

  .hp-kicker.center { justify-content: center; }
  .hp-kicker.center::before { content: ''; flex: 0 0 40px; height: 1px; background: rgba(74,124,89,0.35); }
  .hp-kicker.light-k { color: var(--mist); }
  .hp-kicker.light-k::after { background: rgba(157,196,170,0.3); }
  .hp-kicker.light-k::before { background: rgba(157,196,170,0.3); }

  .hp-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 4.5vw, 3.5rem);
    font-weight: 900; color: var(--ink);
    line-height: 1.05; letter-spacing: -0.02em;
  }
  .hp-section-title em { font-style: italic; color: var(--sage); font-weight: 400; }
  .hp-section-title.on-dark { color: var(--cream); }
  .hp-section-title.on-dark em { color: var(--mist); }

  .hp-section-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 56px; flex-wrap: wrap; gap: 16px;
  }

  .hp-view-all {
    display: inline-flex; align-items: center; gap: 8px;
    color: var(--sage); font-size: 0.82rem; font-weight: 500;
    text-decoration: none; transition: all 0.2s;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.05em;
    border-bottom: 1px solid rgba(74,124,89,0.3); padding-bottom: 2px;
  }
  .hp-view-all:hover { color: var(--moss); gap: 12px; border-color: var(--moss); }

  /* ════════════════════════════════════
     WHY SECTION — oversized cards
  ════════════════════════════════════ */
  .hp-why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }

  .hp-why-card {
    background: var(--paper);
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 24px; padding: 36px 24px;
    text-align: center;
    position: relative; overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s, border-color 0.3s;
  }
  .hp-why-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, var(--sage), transparent);
    transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .hp-why-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(0,0,0,0.1); border-color: rgba(74,124,89,0.25); }
  .hp-why-card:hover::before { transform: scaleX(1); }

  .hp-why-icon {
    width: 70px; height: 70px; margin: 0 auto 20px;
    background: rgba(74,124,89,0.08);
    border: 1px solid rgba(74,124,89,0.14);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    color: var(--sage); font-size: 24px;
    transition: all 0.4s cubic-bezier(0.34,1.4,0.64,1);
  }
  .hp-why-card:hover .hp-why-icon {
    background: linear-gradient(135deg, var(--sage), var(--moss));
    color: var(--cream); border-color: transparent;
    transform: rotate(-6deg) scale(1.1);
    box-shadow: 0 8px 24px rgba(45,90,61,0.3);
  }

  .hp-why-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 10px;
  }
  .hp-why-desc { color: var(--warm); font-size: 0.84rem; font-weight: 300; line-height: 1.75; }

  /* ════════════════════════════════════
     CATEGORIES — dark dramatic cards
  ════════════════════════════════════ */
  .hp-cats-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 12px; }

  .hp-cat-card {
    position: relative; background: var(--white);
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px; text-align: center; text-decoration: none;
    overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 140px; padding: 24px 10px 20px; gap: 10px;
    transition: transform 0.45s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s, border-color 0.3s;
  }
  .hp-cat-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(150deg, var(--moss) 0%, #162b1d 100%);
    transform: translateY(108%);
    transition: transform 0.46s cubic-bezier(0.76,0,0.24,1);
    z-index: 0; border-radius: inherit;
  }
  .hp-cat-card:hover::before { transform: translateY(0); }
  .hp-cat-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(20,55,32,0.3); border-color: transparent; }

  .hp-cat-icon {
    position: relative; z-index: 1;
    width: 56px; height: 56px;
    background: rgba(74,124,89,0.1); border: 1.5px solid rgba(74,124,89,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
    transition: all 0.46s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hp-cat-card:hover .hp-cat-icon {
    background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25);
    transform: scale(1.15) translateY(-3px);
  }

  .hp-cat-name {
    position: relative; z-index: 1;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.02em;
    color: #5c4a32;
    transition: color 0.3s, transform 0.38s;
  }
  .hp-cat-card:hover .hp-cat-name { color: #e8d5b0; transform: translateY(1px); }

  /* ════════════════════════════════════
     PRODUCT & FARMER GRIDS
  ════════════════════════════════════ */
  .hp-products-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .hp-farmers-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }

  /* ════════════════════════════════════
     FEATURE STRIP — full-bleed dark editorial
  ════════════════════════════════════ */
  .hp-feature-strip {
    background: var(--ink);
    padding: 100px 2rem;
    position: relative; overflow: hidden;
  }
  .hp-feature-strip::before {
    content: 'FRESH';
    position: absolute; top: -60px; right: -40px;
    font-family: 'Playfair Display', serif;
    font-size: 22vw; font-weight: 900; font-style: italic;
    color: rgba(157,196,170,0.025);
    pointer-events: none; line-height: 1; letter-spacing: -0.04em;
    user-select: none;
  }
  .hp-feature-strip-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
    align-items: center; position: relative; z-index: 1;
  }

  .hp-feature-img {
    border-radius: 20px;
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, rgba(74,124,89,0.2), rgba(11,26,13,0.8));
    position: relative; overflow: hidden;
  }
  .hp-feature-img img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: inherit;
    filter: grayscale(15%);
    transition: transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.5s;
  }
  .hp-feature-img:hover img { transform: scale(1.04); filter: grayscale(0%); }
  .hp-feature-img-overlay {
    position: absolute; inset: 0; border-radius: inherit;
    background: linear-gradient(to top, rgba(11,26,13,0.5) 0%, transparent 50%);
  }

  /* Floating badge on image */
  .hp-feature-badge {
    position: absolute; bottom: 24px; left: 24px;
    background: rgba(11,26,13,0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(157,196,170,0.15);
    border-radius: 14px; padding: 14px 18px;
    display: flex; align-items: center; gap: 12px;
    z-index: 2;
  }
  .hp-feature-badge-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--sage), var(--moss));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--cream); font-size: 14px;
    flex-shrink: 0;
  }
  .hp-feature-badge-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 700; color: var(--cream); line-height: 1;
  }
  .hp-feature-badge-label { font-size: 0.7rem; color: rgba(157,196,170,0.6); font-weight: 300; }

  .hp-feature-text { }
  .hp-feature-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 900; color: var(--cream);
    line-height: 1.05; letter-spacing: -0.02em;
    margin-bottom: 24px;
  }
  .hp-feature-title em { font-style: italic; color: var(--mist); font-weight: 400; }

  .hp-feature-body {
    color: rgba(157,196,170,0.6);
    font-size: 0.92rem; font-weight: 300;
    line-height: 1.85; margin-bottom: 36px;
  }

  /* Checklist */
  .hp-feature-checks { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
  .hp-feature-check-row {
    display: flex; align-items: center; gap: 12px;
    font-size: 0.88rem; color: rgba(157,196,170,0.75); font-weight: 300;
    padding: 10px 0; border-bottom: 1px solid rgba(157,196,170,0.06);
    transition: color 0.2s, padding-left 0.2s;
  }
  .hp-feature-check-row:hover { color: var(--mist); padding-left: 4px; }
  .hp-feature-check-row:last-child { border-bottom: none; }
  .hp-check-icon {
    width: 22px; height: 22px; flex-shrink: 0;
    background: rgba(74,124,89,0.15); border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--sage); font-size: 10px;
  }

  /* ════════════════════════════════════
     CTA — dramatic full bleed close
  ════════════════════════════════════ */
  .hp-cta-section {
    background: var(--ink);
    padding: 140px 2rem;
    position: relative; overflow: hidden;
  }
  .hp-cta-section::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 25% 50%, rgba(74,124,89,0.2) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 30%, rgba(201,168,76,0.07) 0%, transparent 50%);
  }
  /* Big decorative ring */
  .hp-cta-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 700px; height: 700px;
    border: 1px solid rgba(74,124,89,0.06);
    border-radius: 50%;
    animation: slow-spin 30s linear infinite;
    pointer-events: none;
  }
  .hp-cta-ring-2 {
    width: 500px; height: 500px;
    border-color: rgba(74,124,89,0.04);
    animation: slow-spin 20s linear infinite reverse;
  }
  @keyframes slow-spin { from{transform:translate(-50%,-50%) rotate(0)} to{transform:translate(-50%,-50%) rotate(360deg)} }

  .hp-cta-inner {
    max-width: 680px; margin: 0 auto;
    text-align: center; position: relative; z-index: 1;
  }
  .hp-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 6vw, 5.5rem);
    font-weight: 900; color: var(--cream);
    line-height: 1.0; letter-spacing: -0.03em;
    margin-bottom: 22px;
  }
  .hp-cta-title em { font-style: italic; color: var(--mist); font-weight: 400; }
  .hp-cta-sub {
    color: rgba(157,196,170,0.5);
    font-size: 1rem; font-weight: 300;
    line-height: 1.8; max-width: 420px; margin: 0 auto 48px;
  }
  .hp-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .hp-cta-btn-light {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--cream); color: var(--ink);
    border-radius: 12px; padding: 15px 34px;
    font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 500;
    text-decoration: none; transition: all 0.28s; letter-spacing: 0.01em;
  }
  .hp-cta-btn-light:hover { background: #f8f2e0; box-shadow: 0 8px 28px rgba(0,0,0,0.3); transform: translateY(-3px); }

  .hp-cta-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: rgba(232,213,163,0.7);
    border: 1px solid rgba(232,213,163,0.2);
    border-radius: 12px; padding: 14px 28px;
    font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 400;
    text-decoration: none; transition: all 0.25s;
  }
  .hp-cta-btn-outline:hover { border-color: rgba(232,213,163,0.5); color: var(--cream); transform: translateY(-2px); }

  /* ════════════════════════════════════
     EMPTY STATES
  ════════════════════════════════════ */
  .hp-empty { grid-column: 1/-1; text-align: center; padding: 60px 20px; }
  .hp-empty-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--ink); margin-bottom: 8px; }
  .hp-empty-sub { color: var(--warm); font-size: 0.85rem; font-weight: 300; margin-bottom: 20px; }
  .hp-empty-link { color: var(--sage); font-size: 0.85rem; font-weight: 500; text-decoration: none; font-family: 'DM Mono', monospace; letter-spacing: 0.05em; }

  /* ════════════════════════════════════
     RESPONSIVE
  ════════════════════════════════════ */
  @media (max-width: 1024px) {
    .hp-why-grid { grid-template-columns: repeat(2,1fr); }
    .hp-products-grid { grid-template-columns: repeat(2,1fr); }
    .hp-cats-grid { grid-template-columns: repeat(3,1fr); }
    .hp-farmers-grid { grid-template-columns: repeat(2,1fr); }
    .hp-stats-inner { grid-template-columns: repeat(2,1fr); }
    .hp-stat { border-right: none; border-bottom: 1px solid rgba(157,196,170,0.12); }
    .hp-stat:last-child, .hp-stat:nth-child(even) { border-right: none; }
    .hp-stat:nth-child(odd) { border-right: 1px solid rgba(157,196,170,0.12); }
    .hp-feature-strip-inner { grid-template-columns: 1fr; gap: 48px; }
  }
  @media (max-width: 640px) {
    .hp-why-grid, .hp-products-grid, .hp-farmers-grid { grid-template-columns: 1fr; }
    .hp-cats-grid { grid-template-columns: repeat(2,1fr); }
    .hp-stats-inner { grid-template-columns: repeat(2,1fr); }
  }
`;

/* ═══════════════════════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════════════════════ */
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.6,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.55 + 0.1),
      alpha: Math.random() * 0.4 + 0.08,
      pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.pulse += 0.016; p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157,196,170,${a})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="hp-canvas" />;
};

/* ═══════════════════════════════════════════════════════════════════
   PARALLAX MOUSE HOOK
═══════════════════════════════════════════════════════════════════ */
const useParallax = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      el.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    };
    const reset = () => { el.style.transform = "scale(1.08) translate(0,0)"; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", reset);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseleave", reset); };
  }, [ref]);
};

/* ═══════════════════════════════════════════════════════════════════
   HOMEPAGE
═══════════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const dispatch = useDispatch();
  const bgRef = useRef(null);
  useParallax(bgRef);

  const { products   = [], loading: productLoading   } = useSelector((s) => s.products);
  const { farmers    = [], loading: farmerLoading    } = useSelector((s) => s.farmers);
  const { categories = [], loading: categoryLoading  } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <>
      <style>{STYLE}</style>
      <div className="hp-root">

        {/* ① HERO */}
        <section className="hp-hero">
          <div ref={bgRef} className="hp-hero-bg" />
          <div className="hp-hero-overlay" />
          <div className="hp-hero-grain" />
          <div className="hp-hero-vignette" />
          <ParticleCanvas />

          <div className="hp-hero-content">
            <div className="hp-hero-inner">
              <div className="hp-badge">
                <div className="hp-badge-dot" />
                <span>KrishiSahayi</span>
                <div className="hp-badge-dot" />
              </div>

              <h1 className="hp-headline">
                Farm Fresh,
                <span className="hp-headline-line2">Straight to You</span>
              </h1>

              <p className="hp-sub">
                The freshest locally grown produce, delivered directly from farmer to table.
                No middlemen. No compromise.
              </p>

              <div className="hp-ctas">
                <Link to="/products" className="hp-cta-primary">
                  Shop Now <FaArrowRight size={12} />
                </Link>
                <Link to="/farmers" className="hp-cta-secondary">
                  <FaUsers size={13} /> Meet Our Farmers
                </Link>
              </div>
            </div>
          </div>

          <div className="hp-scroll">
            <div className="hp-scroll-line" />
            <span>scroll</span>
          </div>
        </section>

        {/* ② STATS */}
        <div className="hp-stats">
          <div className="hp-stats-inner">
            {[
              { end: 5,   suffix: "+", label: "Local Farmers" },
              { end: 50,  suffix: "+", label: "Products Listed" },
              { end: 2,   suffix: "+", label: "Happy Customers" },
              { end: 98,  suffix: "%", label: "Satisfaction Rate" },
            ].map((s, i) => (
              <div key={i} className="hp-stat">
                <div className="hp-stat-num">
                  <em><CountUp end={s.end} suffix={s.suffix} duration={1800} /></em>
                </div>
                <div className="hp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ③ MARQUEE LIGHT */}
        <MarqueeStrip variant="light" speed={28} />

        {/* ④ WHY US */}
        <section className="hp-section light">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <div className="hp-kicker center">Why KrishiSahayi</div>
              <h2 className="hp-section-title" style={{ textAlign: "center", marginBottom: 52 }}>
                The <em>Freshest</em> Way to Shop
              </h2>
            </ScrollReveal>

            <StaggerReveal animation="scaleUp" staggerDelay={90} className="hp-why-grid">
              {[
                { icon: <FaLeaf />,          title: "Farm Fresh",        desc: "Harvested at peak ripeness and delivered straight — no cold storage, no compromise on taste." },
                { icon: <FaUsers />,         title: "Support Farmers",   desc: "Every purchase goes directly to a local farming family. Your money makes a genuine difference." },
                { icon: <FaShoppingBasket />, title: "Seasonal Variety", desc: "A rotating selection of seasonal fruits, vegetables, grains, and artisan produce." },
                { icon: <FaHandshake />,     title: "Direct Connection", desc: "Chat with farmers, ask questions, and know exactly how and where your food is grown." },
              ].map((item, i) => (
                <div key={i} className="hp-why-card">
                  <div className="hp-why-icon">{item.icon}</div>
                  <div className="hp-why-title">{item.title}</div>
                  <p className="hp-why-desc">{item.desc}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* ⑤ FEATURED PRODUCTS */}
        <section className="hp-section beige">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <div className="hp-section-header">
                <div>
                  <div className="hp-kicker">Handpicked for You</div>
                  <h2 className="hp-section-title" style={{ marginBottom: 0 }}>
                    Featured <em>Products</em>
                  </h2>
                </div>
                <Link to="/products" className="hp-view-all">
                  View All <FaArrowRight size={11} />
                </Link>
              </div>
            </ScrollReveal>

            {productLoading ? (
              <SkeletonGrid count={4} type="product" columns="repeat(4,1fr)" gap={20} />
            ) : products.length > 0 ? (
              <StaggerReveal animation="fadeUp" staggerDelay={75} className="hp-products-grid">
                {products.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </StaggerReveal>
            ) : (
              <div className="hp-empty">
                <div className="hp-empty-title">No Products Yet</div>
                <p className="hp-empty-sub">Check back soon for fresh listings!</p>
                <Link to="/products" className="hp-empty-link">Browse All →</Link>
              </div>
            )}
          </div>
        </section>

        {/* ⑥ CATEGORIES */}
        <section className="hp-section light">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <div className="hp-kicker center">What Are You Looking For</div>
              <h2 className="hp-section-title" style={{ textAlign: "center", marginBottom: 52 }}>
                Browse by <em>Category</em>
              </h2>
            </ScrollReveal>

            {categoryLoading ? (
              <SkeletonGrid count={6} type="product" columns="repeat(6,1fr)" gap={12} />
            ) : categories.length === 0 ? (
              <div className="hp-empty"><div className="hp-empty-title">Categories Coming Soon</div></div>
            ) : (
              <StaggerReveal animation="scaleUp" staggerDelay={50} className="hp-cats-grid">
                {categories.map((cat) => (
                  <Link key={cat._id} to={`/products?category=${cat._id}`} className="hp-cat-card">
                    <div className="hp-cat-icon"><span>{cat.icon}</span></div>
                    <div className="hp-cat-name">{cat.name}</div>
                  </Link>
                ))}
              </StaggerReveal>
            )}
          </div>
        </section>

        {/* ⑦ MARQUEE DARK */}
        <MarqueeStrip variant="dark" speed={34} direction="right" />

        {/* ⑧ FEATURE STRIP — editorial dark */}
        <section className="hp-feature-strip">
          <div className="hp-feature-strip-inner">
            <ScrollReveal animation="fadeLeft">
              <div className="hp-feature-img">
                <img src="/farm-hero.png" alt="Fresh produce" />
                <div className="hp-feature-img-overlay" />
                <div className="hp-feature-badge">
                  <div className="hp-feature-badge-icon"><FaLeaf size={13} /></div>
                  <div>
                    <div className="hp-feature-badge-num">100%</div>
                    <div className="hp-feature-badge-label">Locally Sourced</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeRight" delay={150}>
              <div className="hp-feature-text">
                <div className="hp-kicker light-k"><FaLeaf size={9} /> Our Commitment</div>
                <h2 className="hp-feature-title">
                  Real Farmers,<br /><em>Real Food</em>
                </h2>
                <p className="hp-feature-body">
                  Every product on KrishiSahayi comes from a verified local farmer.
                  We vet every listing, guarantee freshness, and ensure every rupee
                  you spend reaches the hands that deserve it most.
                </p>
                <div className="hp-feature-checks">
                  {[
                    "Verified farmer profiles with farm inspections",
                    "Harvest-to-doorstep in under 24 hours",
                    "Zero synthetic preservatives — ever",
                    "Seasonal menus updated weekly",
                    "Direct chat with your farmer, anytime",
                  ].map((item, i) => (
                    <div key={i} className="hp-feature-check-row">
                      <div className="hp-check-icon"><FaLeaf size={8} /></div>
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/about" className="hp-cta-btn-light" style={{ display: "inline-flex" }}>
                  Learn Our Story <FaArrowRight size={12} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ⑨ OUR FARMERS */}
        <section className="hp-section beige">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <div className="hp-section-header">
                <div>
                  <div className="hp-kicker">Meet the Growers</div>
                  <h2 className="hp-section-title" style={{ marginBottom: 0 }}>
                    Our <em>Farmers</em>
                  </h2>
                </div>
                <Link to="/farmers" className="hp-view-all">
                  All Farmers <FaArrowRight size={11} />
                </Link>
              </div>
            </ScrollReveal>

            {farmerLoading ? (
              <SkeletonGrid count={3} type="farmer" columns="repeat(3,1fr)" gap={22} />
            ) : farmers.length > 0 ? (
              <StaggerReveal animation="fadeLeft" staggerDelay={100} className="hp-farmers-grid">
                {farmers.slice(0, 3).map((f) => <FarmerCard key={f._id} farmer={f} />)}
              </StaggerReveal>
            ) : (
              <div className="hp-empty">
                <div className="hp-empty-title">No Farmers Yet</div>
                <p className="hp-empty-sub">We're connecting with local farmers — check back soon.</p>
                <Link to="/farmers" className="hp-empty-link">View All Farmers →</Link>
              </div>
            )}
          </div>
        </section>

        {/* ⑩ CTA */}
        <section className="hp-cta-section">
          <div className="hp-cta-ring" />
          <div className="hp-cta-ring hp-cta-ring-2" />
          <div className="hp-cta-inner">
            <ScrollReveal animation="fadeUp" delay={100}>
              <div className="hp-kicker center light-k" style={{ justifyContent: "center", marginBottom: 20 }}>
                <FaLeaf size={9} /> Join the Community
              </div>
              <h2 className="hp-cta-title">
                Ready to Eat<br /><em>Fresh?</em>
              </h2>
              <p className="hp-cta-sub">
                Join farmers and consumers already building a fairer, more sustainable food system — one harvest at a time.
              </p>
              <div className="hp-cta-btns">
                <Link to="/register" className="hp-cta-btn-light">
                  Sign Up Free <FaArrowRight size={12} />
                </Link>
                <Link to="/about" className="hp-cta-btn-outline">
                  Learn More
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;