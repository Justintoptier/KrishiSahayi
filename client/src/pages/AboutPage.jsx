import { Link } from "react-router-dom";
import {
  FaLeaf, FaUsers, FaHandshake, FaShoppingBasket, FaCheck,
} from "react-icons/fa";
import { member1, member2, member3 } from "../assets";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  .ap-root { font-family: 'Jost', sans-serif; background: #f9f5ef; }

  /* Hero */
  .ap-hero {
    min-height: 92vh; display: flex; align-items: center; justify-content: center;
    background: #f9f5ef; position: relative; overflow: hidden; padding: 80px 2rem;
  }
  .ap-hero::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(101,78,51,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(101,78,51,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .ap-hero::after {
    content: ''; position: absolute;
    top: -100px; right: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  .ap-hero-inner { text-align: center; position: relative; z-index: 1; max-width: 700px; }

  .ap-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(74,124,89,0.1); border: 1px solid rgba(74,124,89,0.2);
    color: #4a7c59; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    padding: 6px 16px; border-radius: 100px; margin-bottom: 24px;
  }

  .ap-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 700; color: #2d1f0e; line-height: 1.1; margin-bottom: 24px;
  }

  .ap-hero-title em { font-style: italic; color: #4a7c59; }

  .ap-hero-sub {
    font-size: 1.1rem; color: #8a7a65; font-weight: 300;
    line-height: 1.7; max-width: 560px; margin: 0 auto 40px;
  }

  .ap-hero-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  .ap-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #4a7c59, #2d5a3d);
    color: #e8d5b0; border-radius: 12px; padding: 13px 28px;
    font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: all 0.25s;
  }
  .ap-btn-primary:hover { opacity: 0.9; box-shadow: 0 6px 20px rgba(45,90,61,0.3); transform: translateY(-1px); }

  .ap-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1.5px solid rgba(101,78,51,0.25); color: #5c4a32;
    border-radius: 12px; padding: 12px 24px;
    font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 500;
    text-decoration: none; background: transparent; transition: all 0.2s;
  }
  .ap-btn-outline:hover { border-color: #4a7c59; color: #2d5a3d; background: rgba(74,124,89,0.06); }

  /* Mission section */
  .ap-section { max-width: 1100px; margin: 0 auto; padding: 80px 2rem; }

  .ap-mission {
    background: linear-gradient(135deg, #1e2a1f, #2d5a3d);
    border-radius: 24px; padding: 64px;
    display: flex; gap: 56px; align-items: center;
    position: relative; overflow: hidden;
  }
  .ap-mission::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(74,124,89,0.2) 0%, transparent 55%);
  }
  .ap-mission-text { flex: 1; position: relative; }
  .ap-mission-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(125,184,148,0.15); border: 1px solid rgba(125,184,148,0.25);
    color: #7db894; border-radius: 100px; padding: 5px 14px;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 20px;
  }
  .ap-mission-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 700; color: #e8d5b0; margin-bottom: 20px; line-height: 1.2;
  }
  .ap-mission-title em { font-style: italic; color: #7db894; }
  .ap-mission-body { color: #8a9e8a; font-size: 0.95rem; font-weight: 300; line-height: 1.75; }
  .ap-mission-body p + p { margin-top: 14px; }

  .ap-mission-icon {
    flex-shrink: 0; width: 140px; height: 140px;
    background: rgba(74,124,89,0.2); border: 1px solid rgba(125,184,148,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #7db894; font-size: 52px; position: relative;
    transition: transform 0.3s;
  }
  .ap-mission-icon:hover { transform: scale(1.05); }

  /* How it works */
  .ap-how-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 700; color: #2d1f0e;
    text-align: center; margin-bottom: 48px;
  }
  .ap-how-title em { font-style: italic; color: #4a7c59; }

  .ap-how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

  .ap-how-card {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px; padding: 36px 28px; text-align: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.03);
    transition: all 0.3s;
  }
  .ap-how-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }

  .ap-how-icon {
    width: 64px; height: 64px; margin: 0 auto 20px;
    background: rgba(74,124,89,0.1); border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    color: #4a7c59; font-size: 24px;
  }

  .ap-how-step {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #8a7a65; margin-bottom: 10px;
  }

  .ap-how-card h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 700; color: #2d1f0e; margin-bottom: 12px;
  }

  .ap-how-card p { color: #8a7a65; font-size: 0.88rem; font-weight: 300; line-height: 1.7; }

  /* Benefits */
  .ap-benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .ap-benefit-card {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px; padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  }

  .ap-benefit-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 700; color: #2d5a3d; margin-bottom: 18px;
  }

  .ap-benefit-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid rgba(101,78,51,0.06);
    font-size: 0.88rem; color: #3d2f1e; font-weight: 300; line-height: 1.5;
  }
  .ap-benefit-item:last-child { border-bottom: none; }
  .ap-benefit-check { color: #4a7c59; flex-shrink: 0; margin-top: 2px; }

  /* Team */
  .ap-team-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 700; color: #2d1f0e;
    text-align: center; margin-bottom: 8px;
  }
  .ap-team-sub { text-align: center; color: #8a7a65; margin-bottom: 48px; font-weight: 300; }

  .ap-team-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    max-width: 780px; margin: 0 auto;
  }

  .ap-team-card {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px; padding: 32px 24px;
    display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.03); text-align: center;
    transition: all 0.3s;
  }
  .ap-team-card:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(0,0,0,0.08); }

  .ap-team-img-wrap { position: relative; margin-bottom: 20px; }
  .ap-team-img-glow {
    position: absolute; inset: -4px; background: linear-gradient(135deg, #4a7c59, #7db894);
    border-radius: 50%; opacity: 0; transition: opacity 0.3s; z-index: 0;
  }
  .ap-team-card:hover .ap-team-img-glow { opacity: 0.35; }
  .ap-team-img {
    width: 96px; height: 96px; border-radius: 50%; object-fit: cover;
    border: 3px solid rgba(74,124,89,0.3); position: relative; z-index: 1;
  }
  .ap-team-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 700; color: #2d1f0e; margin-bottom: 14px;
  }
  .ap-linkedin {
    display: inline-flex; align-items: center; gap: 7px;
    color: #4a7c59; font-size: 0.8rem; font-weight: 500;
    text-decoration: none; transition: color 0.2s;
  }
  .ap-linkedin:hover { color: #2d5a3d; }

  /* CTA */
  .ap-cta {
    background: linear-gradient(135deg, #1e2a1f, #2d5a3d);
    border-radius: 24px; padding: 64px; text-align: center;
    position: relative; overflow: hidden;
  }
  .ap-cta::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(74,124,89,0.2) 0%, transparent 65%);
  }
  .ap-cta-inner { position: relative; }
  .ap-cta h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 700; color: #e8d5b0; margin-bottom: 16px;
  }
  .ap-cta h2 em { font-style: italic; color: #7db894; }
  .ap-cta p { color: #8a9e8a; font-size: 0.95rem; font-weight: 300; max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
  .ap-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  .ap-cta-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: #e8d5b0; color: #2d1f0e; border-radius: 12px; padding: 13px 28px;
    font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: all 0.25s;
  }
  .ap-cta-primary:hover { background: #f4ede0; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }

  .ap-cta-outline {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1.5px solid rgba(232,213,176,0.3); color: #e8d5b0;
    border-radius: 12px; padding: 12px 24px;
    font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 500;
    text-decoration: none; background: transparent; transition: all 0.2s;
  }
  .ap-cta-outline:hover { border-color: rgba(232,213,176,0.6); background: rgba(232,213,176,0.08); }

  @media (max-width: 768px) {
    .ap-mission { flex-direction: column; padding: 40px 28px; }
    .ap-how-grid, .ap-benefits-grid { grid-template-columns: 1fr; }
    .ap-team-grid { grid-template-columns: 1fr; }
  }
`;

const teamMembers = [
  { id: 1, name: "Justin Juby", pic: member1, linkedin: "https://www.linkedin.com/in/justinjuby/" },
  { id: 2, name: "Sagnik Roy Chowdhury", pic: member2, linkedin: "https://www.linkedin.com/in/mateeb-haider-233b6b254/" },
  { id: 3, name: "Franklin Babu", pic: member3, linkedin: "https://www.linkedin.com/in/franklin-babu-852022327/" },
];

const AboutPage = () => (
  <>
    <style>{STYLE}</style>
    <div className="ap-root">

      {/* Hero */}
      <section className="ap-hero">
        <div className="ap-hero-inner">
          <div className="ap-eyebrow"><FaLeaf size={10} /> Our Story</div>
          <h1 className="ap-hero-title">About <em>KrishiSahayi</em></h1>
          <p className="ap-hero-sub">
            Connecting local farmers with consumers to promote sustainable agriculture
            and strengthen the bonds of community.
          </p>
          <div className="ap-hero-ctas">
            <Link to="/products" className="ap-btn-primary">Browse Products</Link>
            <Link to="/farmers" className="ap-btn-outline">Meet Farmers</Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <div className="ap-section">
        <div className="ap-mission">
          <div className="ap-mission-text">
            <div className="ap-mission-badge"><FaLeaf size={9} /> Our Mission</div>
            <h2 className="ap-mission-title">Bridging Farm <em>& Fork</em></h2>
            <div className="ap-mission-body">
              <p>KrishiSahayi was founded with a simple yet powerful mission: to create a direct link between local farmers and consumers. We believe everyone deserves access to fresh, locally grown produce — and farmers deserve fair compensation.</p>
              <p>By eliminating middlemen and creating a transparent marketplace, we're building a sustainable food system that benefits producers and consumers alike while reducing environmental impact.</p>
            </div>
          </div>
          <div className="ap-mission-icon"><FaLeaf /></div>
        </div>
      </div>

      {/* How it works */}
      <div className="ap-section" style={{ paddingTop: 0 }}>
        <h2 className="ap-how-title">How It <em>Works</em></h2>
        <div className="ap-how-grid">
          {[
            { icon: <FaUsers />, step: "Step 01", title: "Connect", body: "Farmers create profiles showcasing their farms and available produce. Consumers discover local farms in their area." },
            { icon: <FaShoppingBasket />, step: "Step 02", title: "Order", body: "Browse products, select items, and place orders directly with farmers. Choose pickup or delivery at your convenience." },
            { icon: <FaHandshake />, step: "Step 03", title: "Enjoy", body: "Receive fresh, locally grown produce straight from the source. Build lasting relationships with the people who grow your food." },
          ].map((item, i) => (
            <div key={i} className="ap-how-card">
              <div className="ap-how-icon">{item.icon}</div>
              <div className="ap-how-step">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="ap-section" style={{ paddingTop: 0 }}>
        <h2 className="ap-how-title" style={{ marginBottom: 40 }}>The <em>Benefits</em></h2>
        <div className="ap-benefits-grid">
          <div className="ap-benefit-card">
            <div className="ap-benefit-title">For Consumers</div>
            {["Access to fresher, more nutritious produce", "Know exactly where your food comes from", "Support local economy and sustainable farming", "Reduced environmental impact from shorter supply chains", "Direct communication with farmers"].map((item, i) => (
              <div key={i} className="ap-benefit-item">
                <FaCheck size={12} className="ap-benefit-check" /> {item}
              </div>
            ))}
          </div>
          <div className="ap-benefit-card">
            <div className="ap-benefit-title">For Farmers</div>
            {["Higher profit margins by selling direct", "Stable local market for products", "Reduced waste through better demand planning", "Showcase your sustainable farming practices", "Direct feedback from your customers"].map((item, i) => (
              <div key={i} className="ap-benefit-item">
                <FaCheck size={12} className="ap-benefit-check" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="ap-section" style={{ paddingTop: 0 }}>
        <h2 className="ap-team-title">Meet the <em>Team</em></h2>
        <p className="ap-team-sub">The passionate people behind KrishiSahayi</p>
        <div className="ap-team-grid">
          {teamMembers.map((m) => (
            <div key={m.id} className="ap-team-card">
              <div className="ap-team-img-wrap">
                <div className="ap-team-img-glow" />
                <img src={m.pic} alt={m.name} className="ap-team-img" />
              </div>
              <div className="ap-team-name">{m.name}</div>
              <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="ap-linkedin">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                </svg>
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 80px" }}>
        <div className="ap-cta">
          <div className="ap-cta-inner">
            <h2>Join Our <em>Community</em></h2>
            <p>Whether you're a farmer or a consumer seeking fresh, local produce — KrishiSahayi is built for you.</p>
            <div className="ap-cta-btns">
              <Link to="/register" className="ap-cta-primary">Sign Up Free</Link>
              <Link to="/products" className="ap-cta-outline">Browse Products</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AboutPage;