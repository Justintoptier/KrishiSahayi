"use client";

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaLeaf, FaUsers, FaShoppingBasket, FaHandshake } from "react-icons/fa";

// ── Floating particle canvas ──────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.6 + 0.2),
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.pulse += 0.02;
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134,239,172,${a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-20 pointer-events-none"
    />
  );
};

// ── Parallax mouse effect on hero image ──────────────────
const useParallax = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth  - 0.5) * 18;
      const y = (clientY / innerHeight - 0.5) * 10;
      el.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    };
    const reset = () => { el.style.transform = "scale(1.08) translate(0,0)"; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", reset);
    };
  }, [ref]);
};

const HomePage = () => {
  const dispatch   = useDispatch();
  const bgRef      = useRef(null);
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
    <div>
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Parallax background */}
        <div
          ref={bgRef}
          className="absolute inset-[-5%] z-0"
          style={{
            backgroundImage: "url('/farm-hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.12s ease-out",
            willChange: "transform",
          }}
        />

        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,40,0,0.35) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Animated vignette pulse */}
        <div className="absolute inset-0 z-10 hero-vignette" />

        {/* Floating particles */}
        <ParticleCanvas />

        {/* Diagonal light streak */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="hero-streak" />
        </div>

        {/* Content — staggered fade-up */}
        <div className="relative z-30 w-full text-center px-4">
          <div className="max-w-3xl mx-auto">

            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full px-4 py-2 mb-8 border border-white/25 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="uppercase tracking-widest">KrishiSahayi · SRM</span>
            </div>

            {/* Headline */}
            <h1 className="hero-title text-5xl md:text-7xl font-black mb-6 text-white leading-tight"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              Connect Directly
              <br />
              <span className="hero-highlight">with Local Farmers</span>
            </h1>

            {/* Sub */}
            <p className="hero-sub text-lg md:text-xl text-white/85 mb-12 max-w-xl mx-auto leading-relaxed"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
            >
              Get fresh, locally grown produce delivered straight from farm to your table.
              Support local agriculture and enjoy seasonal variety.
            </p>

            {/* CTA buttons */}
            <div className="hero-cta flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                className="group relative overflow-hidden bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-green-500/40"
              >
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                to="/farmers"
                className="bg-white/15 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white hover:text-green-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Meet Our Farmers
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent scroll-line" />
            </div>
          </div>
        </div>
      </section>

      {/* CSS animations injected inline */}
      <style>{`
        /* Staggered entry animations */
        .hero-badge  { animation: fadeUp 0.8s ease both; animation-delay: 0.1s; }
        .hero-title  { animation: fadeUp 0.9s ease both; animation-delay: 0.3s; }
        .hero-highlight { 
          background: linear-gradient(90deg, #86efac, #4ade80, #86efac);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeUp 0.9s ease both, shimmer 3s linear infinite;
          animation-delay: 0.3s, 1.2s;
        }
        .hero-sub    { animation: fadeUp 0.9s ease both; animation-delay: 0.5s; }
        .hero-cta    { animation: fadeUp 0.9s ease both; animation-delay: 0.7s; }
        .hero-scroll { animation: fadeUp 1s ease both; animation-delay: 1.2s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Breathing vignette */
        .hero-vignette {
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
          animation: breathe 6s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.8; }
          50%       { opacity: 1; }
        }

        /* Light streak */
        .hero-streak {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 40%;
          height: 200%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
          animation: streak 8s ease-in-out infinite;
          transform: rotate(-15deg);
        }
        @keyframes streak {
          0%   { left: -40%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }

        /* Scroll line drop */
        .scroll-line {
          animation: dropLine 1.8s ease-in-out infinite;
        }
        @keyframes dropLine {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
          50%  { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}</style>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose KrishiSahayi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <FaLeaf className="text-green-500 text-3xl" />, title: "Fresh & Local", desc: "Get the freshest produce harvested directly from local farms." },
              { icon: <FaUsers className="text-green-500 text-3xl" />, title: "Support Local Farmers", desc: "Help sustain local agriculture and support farming families in your community." },
              { icon: <FaShoppingBasket className="text-green-500 text-3xl" />, title: "Seasonal Variety", desc: "Discover a wide variety of seasonal fruits, vegetables, and farm products." },
              { icon: <FaHandshake className="text-green-500 text-3xl" />, title: "Direct Communication", desc: "Connect directly with farmers to learn about their growing practices." },
            ].map((item, i) => (
              <div key={i} className="glass p-4 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products" className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300">View All Products →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productLoading ? (
              <div className="col-span-full flex justify-center py-12"><Loader /></div>
            ) : products.length > 0 ? (
              products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Featured Products Available</h3>
                <p className="text-gray-500 mb-6">Check back soon for new products!</p>
                <Link to="/products" className="text-green-600 hover:text-green-800 font-medium">Browse All Products →</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryLoading ? (
              <div className="col-span-full flex justify-center py-12"><Loader /></div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Categories Coming Soon</h3>
                <p className="text-gray-500">We're working on organizing our products into categories.</p>
              </div>
            ) : (
              categories.map((category) => (
                <Link key={category._id} to={`/products?category=${category._id}`}
                  className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-base text-gray-700">{category.name}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── OUR FARMERS ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Our Farmers</h2>
            <Link to="/farmers" className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300">View All Farmers →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmerLoading ? (
              <div className="col-span-full flex justify-center py-12"><Loader /></div>
            ) : farmers.length > 0 ? (
              farmers.slice(0, 3).map((farmer) => <FarmerCard key={farmer._id} farmer={farmer} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Farmers Available Yet</h3>
                <p className="text-gray-500 mb-6">We're working on connecting with local farmers.</p>
                <Link to="/farmers" className="text-green-600 hover:text-green-800 font-medium">Check Back Later →</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join our community today and start enjoying fresh, local produce while supporting farmers in your area.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="btn bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg">Sign Up Now</Link>
            <Link to="/about" className="btn border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-bold text-lg">Learn More</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;