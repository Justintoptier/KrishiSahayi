"use client";

import { useEffect, useRef } from "react";
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

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  .hp-root { font-family: 'Jost', sans-serif; background: #f9f5ef; }

  .hp-hero {
    position: relative; height: 100vh; min-height: 640px;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .hp-hero-bg {
    position: absolute; inset: -6%;
    background-image: url('/farm-hero.png');
    background-size: cover; background-position: center;
    transition: transform 0.14s ease-out; will-change: transform; z-index: 0;
  }
  .hp-hero-overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(160deg, rgba(14,22,15,0.75) 0%, rgba(30,45,32,0.55) 45%, rgba(10,18,12,0.80) 100%);
  }
  .hp-hero-grain {
    position: absolute; inset: 0; z-index: 2; opacity: 0.04; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
  .hp-hero-vignette {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%);
    animation: hp-breathe 7s ease-in-out infinite;
  }
  @keyframes hp-breathe { 0%,100%{opacity:0.75} 50%{opacity:1} }

  .hp-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; }

  .hp-hero-content { position: relative; z-index: 10; text-align: center; width: 100%; padding: 0 24px; }
  .hp-hero-inner { max-width: 820px; margin: 0 auto; }

  .hp-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.18); color: rgba(232,213,176,0.9);
    border-radius: 100px; padding: 8px 20px; font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 36px;
    animation: hp-fadeUp 0.8s ease both 0.1s;
  }
  .hp-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #7db894; animation: hp-pulse 2s ease-in-out infinite; }
  @keyframes hp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .hp-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 8vw, 6.5rem); font-weight: 700; color: #e8d5b0;
    line-height: 1.05; margin-bottom: 28px;
    text-shadow: 0 4px 48px rgba(0,0,0,0.4);
    animation: hp-fadeUp 0.9s ease both 0.3s;
  }
  .hp-headline em {
    font-style: italic;
    background: linear-gradient(90deg, #7db894, #a8d5b5, #7db894); background-size: 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: hp-shimmer 4s linear infinite 1.2s;
  }
  @keyframes hp-shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }

  .hp-sub {
    font-size: clamp(1rem, 2vw, 1.2rem); font-weight: 300; color: rgba(232,213,176,0.75);
    line-height: 1.7; max-width: 520px; margin: 0 auto 44px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4); animation: hp-fadeUp 0.9s ease both 0.5s;
  }
  .hp-ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; animation: hp-fadeUp 0.9s ease both 0.7s; }

  .hp-cta-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #4a7c59, #2d5a3d); color: #e8d5b0;
    border-radius: 14px; padding: 15px 32px; font-family: 'Jost', sans-serif;
    font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.28s ease;
    box-shadow: 0 8px 32px rgba(45,90,61,0.45);
  }
  .hp-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(45,90,61,0.55); opacity: 0.93; }

  .hp-cta-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
    color: #e8d5b0; border: 1.5px solid rgba(232,213,176,0.3); border-radius: 14px;
    padding: 14px 28px; font-family: 'Jost', sans-serif; font-size: 1rem; font-weight: 500;
    text-decoration: none; transition: all 0.25s ease;
  }
  .hp-cta-secondary:hover { background: rgba(232,213,176,0.12); border-color: rgba(232,213,176,0.5); transform: translateY(-2px); }

  .hp-scroll {
    position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: rgba(232,213,176,0.4); z-index: 10; animation: hp-fadeUp 1s ease both 1.2s;
  }
  .hp-scroll span { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; }
  .hp-scroll-line {
    width: 1px; height: 44px;
    background: linear-gradient(to bottom, rgba(232,213,176,0.35), transparent);
    animation: hp-dropLine 2s ease-in-out infinite;
  }
  @keyframes hp-dropLine {
    0%{transform:scaleY(0);transform-origin:top;opacity:0}
    50%{transform:scaleY(1);opacity:1}
    100%{transform:scaleY(0);transform-origin:bottom;opacity:0}
  }
  @keyframes hp-fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  /* Stats */
  .hp-stats { background: linear-gradient(135deg, #2d5a3d, #1e3a27); padding: 40px 2rem; }
  .hp-stats-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); text-align: center; }
  .hp-stat { padding: 16px; }
  .hp-stat + .hp-stat { border-left: 1px solid rgba(125,184,148,0.15); }
  .hp-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: #e8d5b0; margin-bottom: 4px; }
  .hp-stat-num em { font-style: normal; color: #7db894; }
  .hp-stat-label { font-size: 0.78rem; color: #7a9e80; font-weight: 400; letter-spacing: 0.04em; }

  /* Sections */
  .hp-section { padding: 96px 2rem; }
  .hp-section.light { background: #fefcf8; }
  .hp-section.beige { background: #f9f5ef; }
  .hp-section-inner { max-width: 1200px; margin: 0 auto; }

  .hp-section-eyebrow { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4a7c59; margin-bottom: 12px; }
  .hp-section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3rem); font-weight: 700; color: #2d1f0e; line-height: 1.2; margin-bottom: 52px; }
  .hp-section-title em { font-style: italic; color: #4a7c59; }

  .hp-section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 44px; flex-wrap: wrap; gap: 16px; }
  .hp-view-all { display: inline-flex; align-items: center; gap: 8px; color: #4a7c59; font-size: 0.88rem; font-weight: 600; text-decoration: none; transition: all 0.2s; border-bottom: 1px solid rgba(74,124,89,0.3); padding-bottom: 2px; }
  .hp-view-all:hover { color: #2d5a3d; border-color: #2d5a3d; }

  /* Why grid */
  .hp-why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
  .hp-why-card { background: #fefcf8; border: 1px solid rgba(101,78,51,0.1); border-radius: 20px; padding: 32px 22px; text-align: center; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
  .hp-why-card:hover { transform: translateY(-7px); box-shadow: 0 18px 44px rgba(0,0,0,0.08); border-color: rgba(74,124,89,0.2); }
  .hp-why-icon { width: 66px; height: 66px; margin: 0 auto 18px; background: linear-gradient(135deg, rgba(74,124,89,0.1), rgba(74,124,89,0.05)); border: 1px solid rgba(74,124,89,0.14); border-radius: 18px; display: flex; align-items: center; justify-content: center; color: #4a7c59; font-size: 22px; transition: all 0.35s; }
  .hp-why-card:hover .hp-why-icon { background: linear-gradient(135deg, #4a7c59, #2d5a3d); color: #e8d5b0; border-color: transparent; }
  .hp-why-title { font-family: 'Cormorant Garamond', serif; font-size: 1.18rem; font-weight: 700; color: #2d1f0e; margin-bottom: 8px; }
  .hp-why-desc { color: #8a7a65; font-size: 0.84rem; font-weight: 300; line-height: 1.7; }

  /* Category */
  .hp-cats-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 12px; }
  .hp-cat-card { background: #fefcf8; border: 1px solid rgba(101,78,51,0.1); border-radius: 16px; padding: 26px 10px; text-align: center; text-decoration: none; transition: all 0.3s ease; }
  .hp-cat-card:hover { transform: translateY(-5px); background: linear-gradient(135deg, #4a7c59, #2d5a3d); border-color: transparent; box-shadow: 0 12px 32px rgba(45,90,61,0.25); }
  .hp-cat-icon { width: 50px; height: 50px; margin: 0 auto 12px; background: rgba(74,124,89,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 21px; transition: background 0.3s; }
  .hp-cat-card:hover .hp-cat-icon { background: rgba(255,255,255,0.15); }
  .hp-cat-name { font-size: 0.78rem; font-weight: 600; color: #5c4a32; transition: color 0.3s; }
  .hp-cat-card:hover .hp-cat-name { color: #e8d5b0; }

  /* Grids */
  .hp-products-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .hp-farmers-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }

  /* CTA */
  .hp-cta-section { background: linear-gradient(135deg, #1e2a1f 0%, #2d5a3d 50%, #1a3020 100%); padding: 100px 2rem; position: relative; overflow: hidden; }
  .hp-cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(74,124,89,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(139,105,20,0.12) 0%, transparent 50%); }
  .hp-cta-inner { max-width: 680px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
  .hp-cta-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(125,184,148,0.15); border: 1px solid rgba(125,184,148,0.25); color: #7db894; border-radius: 100px; padding: 6px 16px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 22px; }
  .hp-cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem,5vw,4rem); font-weight: 700; color: #e8d5b0; margin-bottom: 18px; line-height: 1.15; }
  .hp-cta-title em { font-style: italic; color: #7db894; }
  .hp-cta-sub { color: #8a9e8a; font-size: 1rem; font-weight: 300; line-height: 1.75; max-width: 480px; margin: 0 auto 40px; }
  .hp-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .hp-cta-btn-light { display: inline-flex; align-items: center; gap: 8px; background: #e8d5b0; color: #2d1f0e; border-radius: 13px; padding: 14px 30px; font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 700; text-decoration: none; transition: all 0.25s; }
  .hp-cta-btn-light:hover { background: #f4ede0; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
  .hp-cta-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: rgba(232,213,176,0.85); border: 1.5px solid rgba(232,213,176,0.3); border-radius: 13px; padding: 13px 26px; font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all 0.25s; }
  .hp-cta-btn-outline:hover { border-color: rgba(232,213,176,0.6); background: rgba(232,213,176,0.08); transform: translateY(-2px); }

  .hp-empty { grid-column: 1/-1; text-align: center; padding: 50px 20px; }
  .hp-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #2d1f0e; margin-bottom: 6px; }
  .hp-empty-sub { color: #8a7a65; font-size: 0.85rem; font-weight: 300; margin-bottom: 18px; }
  .hp-empty-link { color: #4a7c59; font-size: 0.88rem; font-weight: 500; text-decoration: none; }

  @media (max-width: 1024px) {
    .hp-why-grid { grid-template-columns: repeat(2,1fr); }
    .hp-products-grid { grid-template-columns: repeat(2,1fr); }
    .hp-cats-grid { grid-template-columns: repeat(3,1fr); }
    .hp-farmers-grid { grid-template-columns: repeat(2,1fr); }
    .hp-stats-inner { grid-template-columns: repeat(2,1fr); }
    .hp-stat + .hp-stat { border-left: none; }
    .hp-stat:nth-child(odd) { border-right: 1px solid rgba(125,184,148,0.15); }
  }
  @media (max-width: 640px) {
    .hp-why-grid, .hp-products-grid, .hp-farmers-grid { grid-template-columns: 1fr; }
    .hp-cats-grid { grid-template-columns: repeat(2,1fr); }
    .hp-stats-inner { grid-template-columns: repeat(2,1fr); }
  }
`;

// ── Floating particles ──
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.8, dx: (Math.random() - 0.5) * 0.35,
      dy: -(Math.random() * 0.5 + 0.15), alpha: Math.random() * 0.45 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.pulse += 0.018; p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const a = p.alpha * (0.65 + 0.35 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125,184,148,${a})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="hp-canvas" />;
};

// ── Parallax mouse ──
const useParallax = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      el.style.transform = `scale(1.08) translate(${(e.clientX/window.innerWidth-0.5)*20}px, ${(e.clientY/window.innerHeight-0.5)*12}px)`;
    };
    const reset = () => { el.style.transform = "scale(1.08) translate(0,0)"; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", reset);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseleave", reset); };
  }, [ref]);
};

// ── Main ──
const HomePage = () => {
  const dispatch = useDispatch();
  const bgRef = useRef(null);
  useParallax(bgRef);

  const { products  = [], loading: productLoading  } = useSelector((s) => s.products);
  const { farmers   = [], loading: farmerLoading   } = useSelector((s) => s.farmers);
  const { categories= [], loading: categoryLoading } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <>
      <style>{STYLE}</style>
      <div className="hp-root">

        {/* HERO */}
        <section className="hp-hero">
          <div ref={bgRef} className="hp-hero-bg" />
          <div className="hp-hero-overlay" />
          <div className="hp-hero-grain" />
          <div className="hp-hero-vignette" />
          <ParticleCanvas />
          <div className="hp-hero-content">
            <div className="hp-hero-inner">
              <div className="hp-badge"><div className="hp-badge-dot" /><span>KrishiSahayi · SRM</span></div>
              <h1 className="hp-headline">Farm Fresh,<br /><em>Straight to You</em></h1>
              <p className="hp-sub">Get the freshest locally grown produce delivered from farm to table. Support real farmers, discover seasonal variety.</p>
              <div className="hp-ctas">
                <Link to="/products" className="hp-cta-primary">Shop Now <FaArrowRight size={13} /></Link>
                <Link to="/farmers" className="hp-cta-secondary">Meet Our Farmers</Link>
              </div>
            </div>
          </div>
          <div className="hp-scroll"><span>Scroll</span><div className="hp-scroll-line" /></div>
        </section>

        {/* STATS */}
        <div className="hp-stats">
          <div className="hp-stats-inner">
            {[
              { end: 5,   suffix: "+", label: "Local Farmers" },
              { end: 50,  suffix: "+", label: "Products Listed" },
              { end: 2, suffix: "+", label: "Happy Customers" },
              { end: 98,    suffix: "%", label: "Satisfaction Rate" },
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

        {/* MARQUEE */}
        <MarqueeStrip variant="light" speed={28} />

        {/* WHY */}
        <section className="hp-section light">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <span className="hp-section-eyebrow" style={{ textAlign: "center", display: "block" }}>Why KrishiSahayi</span>
              <h2 className="hp-section-title" style={{ textAlign: "center" }}>The <em>Freshest</em> Way to Shop</h2>
            </ScrollReveal>
            <StaggerReveal animation="scaleUp" staggerDelay={100} className="hp-why-grid">
              {[
                { icon: <FaLeaf />,         title: "Farm Fresh",        desc: "Harvested at peak ripeness and delivered directly — no cold storage, no compromise." },
                { icon: <FaUsers />,        title: "Support Farmers",   desc: "Every purchase goes directly to a local farming family. Your rupee makes a real difference." },
                { icon: <FaShoppingBasket />, title: "Seasonal Variety", desc: "Discover a rotating selection of seasonal fruits, vegetables, grains, and artisan produce." },
                { icon: <FaHandshake />,    title: "Direct Connection", desc: "Chat with farmers, ask questions, and know exactly how your food is grown." },
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

        {/* PRODUCTS */}
        <section className="hp-section beige">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <div className="hp-section-header">
                <div>
                  <span className="hp-section-eyebrow">Handpicked for You</span>
                  <h2 className="hp-section-title" style={{ marginBottom: 0 }}>Featured <em>Products</em></h2>
                </div>
                <Link to="/products" className="hp-view-all">View All <FaArrowRight size={11} /></Link>
              </div>
            </ScrollReveal>
            {productLoading ? (
              <SkeletonGrid count={4} type="product" columns="repeat(4,1fr)" gap={20} />
            ) : products.length > 0 ? (
              <StaggerReveal animation="fadeUp" staggerDelay={80} className="hp-products-grid">
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

        {/* CATEGORIES */}
        <section className="hp-section light">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <span className="hp-section-eyebrow" style={{ textAlign: "center", display: "block" }}>What Are You Looking For</span>
              <h2 className="hp-section-title" style={{ textAlign: "center" }}>Browse by <em>Category</em></h2>
            </ScrollReveal>
            {categoryLoading ? (
              <SkeletonGrid count={6} type="product" columns="repeat(6,1fr)" gap={12} />
            ) : categories.length === 0 ? (
              <div className="hp-empty"><div className="hp-empty-title">Categories Coming Soon</div></div>
            ) : (
              <StaggerReveal animation="scaleUp" staggerDelay={55} className="hp-cats-grid">
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

        {/* MARQUEE DARK */}
        <MarqueeStrip variant="dark" speed={34} direction="right" />

        {/* FARMERS */}
        <section className="hp-section beige">
          <div className="hp-section-inner">
            <ScrollReveal animation="fadeUp">
              <div className="hp-section-header">
                <div>
                  <span className="hp-section-eyebrow">Meet the Growers</span>
                  <h2 className="hp-section-title" style={{ marginBottom: 0 }}>Our <em>Farmers</em></h2>
                </div>
                <Link to="/farmers" className="hp-view-all">All Farmers <FaArrowRight size={11} /></Link>
              </div>
            </ScrollReveal>
            {farmerLoading ? (
              <SkeletonGrid count={3} type="farmer" columns="repeat(3,1fr)" gap={22} />
            ) : farmers.length > 0 ? (
              <StaggerReveal animation="fadeLeft" staggerDelay={110} className="hp-farmers-grid">
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

        {/* CTA */}
        <section className="hp-cta-section">
          <div className="hp-cta-inner">
            <ScrollReveal animation="fadeUp" delay={100}>
              <div className="hp-cta-eyebrow"><FaLeaf size={9} /> Join the Community</div>
              <h2 className="hp-cta-title">Ready to Eat <em>Fresh?</em></h2>
              <p className="hp-cta-sub">Join tons of consumers and farmers already building a better, more sustainable food system.</p>
              <div className="hp-cta-btns">
                <Link to="/register" className="hp-cta-btn-light">Sign Up Free <FaArrowRight size={12} /></Link>
                <Link to="/about" className="hp-cta-btn-outline">Learn More</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;