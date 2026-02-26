import { Link } from "react-router-dom";
import { FaLeaf, FaHome, FaArrowRight } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .nfp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 2rem;
          position: relative;
          overflow: hidden;
        }

        .nfp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse at 20% 40%, rgba(45, 90, 61, 0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 105, 20, 0.05) 0%, transparent 40%);
        }

        .nfp-inner {
          text-align: center;
          position: relative;
          max-width: 520px;
        }

        .nfp-big-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(7rem, 20vw, 12rem);
          font-weight: 700;
          color: rgba(45, 90, 61, 0.08);
          line-height: 1;
          margin-bottom: -20px;
          letter-spacing: -0.04em;
          user-select: none;
        }

        .nfp-icon-wrap {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2d5a3d, #4a7c59);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          box-shadow: 0 8px 32px rgba(45, 90, 61, 0.25);
          position: relative;
        }

        .nfp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 700;
          color: #1e2a1f;
          line-height: 1.15;
          margin-bottom: 14px;
        }

        .nfp-title em { font-style: italic; color: #4a7c59; }

        .nfp-desc {
          color: #8a7a65;
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }

        .nfp-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nfp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 14px;
          padding: 14px 28px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .nfp-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(45, 90, 61, 0.3);
        }

        .nfp-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: transparent;
          color: #4a7c59;
          border: 1px solid rgba(74, 124, 89, 0.3);
          border-radius: 14px;
          padding: 14px 28px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .nfp-btn-secondary:hover {
          background: rgba(74, 124, 89, 0.06);
          border-color: rgba(74, 124, 89, 0.5);
        }
      `}</style>

      <div className="nfp-root">
        <div className="nfp-inner">
          <div className="nfp-big-num">404</div>
          <div className="nfp-icon-wrap">
            <FaLeaf style={{ color: "#e8d5b0", fontSize: 30 }} />
          </div>
          <h1 className="nfp-title">
            Page <em>Not Found</em>
          </h1>
          <p className="nfp-desc">
            Oops — looks like this page has already been harvested. Let's get you back to fresh ground.
          </p>
          <div className="nfp-actions">
            <Link to="/" className="nfp-btn-primary">
              <FaHome size={14} /> Back to Home
            </Link>
            <Link to="/products" className="nfp-btn-secondary">
              Browse Products <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;