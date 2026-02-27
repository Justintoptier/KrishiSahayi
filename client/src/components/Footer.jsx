import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      toast.success("Subscribed successfully!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .footer-root {
          font-family: 'Jost', sans-serif;
          background: #1e2a1f;
          color: #c8b99a;
          padding: 80px 0 0;
          position: relative;
          overflow: hidden;
        }

        .footer-root::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4a7c59, #8b6914, #4a7c59);
        }

        .footer-texture {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 50%, rgba(74, 124, 89, 0.06) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(139, 105, 20, 0.06) 0%, transparent 40%);
          pointer-events: none;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.4fr;
          gap: 4rem;
          padding-bottom: 60px;
          border-bottom: 1px solid rgba(200, 185, 154, 0.1);
        }

        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
          text-decoration: none;
        }

        .footer-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8d5b0;
          font-size: 15px;
        }

        .footer-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #e8d5b0;
          letter-spacing: 0.01em;
        }

        .footer-tagline {
          font-size: 0.875rem;
          color: #8a7a65;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-weight: 300;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(200, 185, 154, 0.08);
          border: 1px solid rgba(200, 185, 154, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a7a65;
          text-decoration: none;
          transition: all 0.25s ease;
          font-size: 13px;
        }

        .social-btn:hover {
          background: rgba(74, 124, 89, 0.2);
          border-color: rgba(74, 124, 89, 0.4);
          color: #7db894;
          transform: translateY(-2px);
        }

        .footer-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #e8d5b0;
          letter-spacing: 0.04em;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(200, 185, 154, 0.12);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          text-decoration: none;
          color: #8a7a65;
          font-size: 0.875rem;
          font-weight: 300;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-link::before {
          content: '';
          width: 16px;
          height: 1px;
          background: #4a7c59;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .footer-link:hover {
          color: #c8b99a;
          padding-left: 4px;
        }

        .footer-link:hover::before {
          opacity: 1;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #8a7a65;
          font-size: 0.875rem;
          font-weight: 300;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .contact-icon {
          color: #4a7c59;
          margin-top: 2px;
          flex-shrink: 0;
          font-size: 13px;
        }

        .newsletter-desc {
          font-size: 0.85rem;
          color: #8a7a65;
          font-weight: 300;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .newsletter-input {
          background: rgba(200, 185, 154, 0.06);
          border: 1px solid rgba(200, 185, 154, 0.15);
          border-radius: 10px;
          padding: 11px 16px;
          color: #c8b99a;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .newsletter-input::placeholder { color: #5a4f42; }

        .newsletter-input:focus {
          border-color: rgba(74, 124, 89, 0.5);
          background: rgba(74, 124, 89, 0.06);
        }

        .newsletter-btn {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .newsletter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(45, 90, 61, 0.4);
        }

        .footer-bottom {
          padding: 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copy {
          font-size: 0.8rem;
          color: #5a4f42;
          font-weight: 300;
        }

        .footer-copy span {
          color: #7db894;
        }

        .footer-bottom-links {
          display: flex;
          gap: 20px;
        }

        .footer-bottom-link {
          font-size: 0.8rem;
          color: #5a4f42;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-bottom-link:hover { color: #8a7a65; }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        }

        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-texture" />
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <Link to="/" className="footer-brand-logo">
                <div className="footer-logo-icon"><FaLeaf /></div>
                <span className="footer-brand-name">KrishiSahayi</span>
              </Link>
              <p className="footer-tagline">
                Bridging the gap between local farmers and conscious consumers. Fresh from the farm, straight to your table.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-btn"><FaInstagram /></a>
                <a href="#" className="social-btn"><FaTwitter /></a>
                <a href="#" className="social-btn"><FaFacebook /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="footer-heading">Explore</h3>
              <ul className="footer-links">
                {[["Home", "/"], ["Products", "/products"], ["Farmers", "/farmers"], ["About Us", "/about"]].map(([text, path]) => (
                  <li key={path}>
                    <Link to={path} className="footer-link">{text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="footer-heading">Contact</h3>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>03241441444</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@teamxyz-srm.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="footer-heading">Stay Updated</h3>
              <p className="newsletter-desc">
                Get weekly updates on fresh seasonal produce and new farmers joining our community.
              </p>
              <form onSubmit={handleSubmit} className="newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              © {currentYear} KrishiSahayi. Crafted with <span>♥</span> by Team XYZ SRM.
            </p>
            <div className="footer-bottom-links">
              
              <a href="#" className="footer-bottom-link">Keep Building 💪</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;