import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaLeaf, FaArrowRight, FaComment } from "react-icons/fa";

const FarmerCard = ({ farmer }) => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  // Deterministic hue from farmer name for avatar gradient
  const hue = farmer.name
    ? (farmer.name.charCodeAt(0) * 17) % 60 + 100
    : 130;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .fcard {
          font-family: 'Jost', sans-serif;
          background: #fefcf8;
          border: 1px solid rgba(101,78,51,0.1);
          border-radius: 22px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.42s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.4s ease,
                      border-color 0.3s ease;
        }

        .fcard:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 52px rgba(50,35,15,0.14);
          border-color: rgba(74,124,89,0.22);
        }

        /* Decorative circle in top-right */
        .fcard::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 130px; height: 130px;
          border-radius: 50%;
          background: rgba(74,124,89,0.04);
          transition: transform 0.5s ease, background 0.5s ease;
        }
        .fcard:hover::before {
          transform: scale(1.5);
          background: rgba(74,124,89,0.07);
        }

        /* Top row: avatar + info */
        .fcard-top {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 18px; position: relative;
        }

        /* Avatar circle */
        .fcard-avatar {
          width: 62px; height: 62px;
          border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.65rem; font-weight: 700;
          color: #fefcf8; position: relative;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fcard:hover .fcard-avatar { transform: scale(1.1) rotate(-4deg); }

        .fcard-avatar-ring {
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 1.5px solid rgba(74,124,89,0.2);
          transition: border-color 0.3s, inset 0.3s;
        }
        .fcard:hover .fcard-avatar-ring {
          border-color: rgba(74,124,89,0.45);
          inset: -4px;
        }

        .fcard-info { flex: 1; min-width: 0; }

        .fcard-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 700; color: #2d1f0e;
          margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .fcard-location {
          display: flex; align-items: center; gap: 5px;
          color: #8a7a65; font-size: 0.77rem;
        }
        .fcard-loc-icon { color: #4a7c59; flex-shrink: 0; }

        /* Divider */
        .fcard-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(101,78,51,0.1), transparent);
          margin: 0 0 16px;
        }

        /* Chips */
        .fcard-chips {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .fcard-chip {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f0e8d8; border: 1px solid rgba(101,78,51,0.12);
          border-radius: 100px; padding: 4px 10px;
          font-size: 0.7rem; color: #5c4a32; font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.25s;
        }
        .fcard-chip.green {
          background: rgba(74,124,89,0.08);
          border-color: rgba(74,124,89,0.18);
          color: #2d5a3d;
        }
        .fcard:hover .fcard-chip.green {
          background: rgba(74,124,89,0.14);
        }

        /* Actions row */
        .fcard-actions {
          display: flex; gap: 10px; align-items: center;
        }

        /* View Farm button */
        .fcard-view-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0; border-radius: 12px; padding: 11px 16px;
          font-family: 'Jost', sans-serif; font-size: 0.84rem; font-weight: 600;
          text-decoration: none;
          position: relative; overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .fcard-view-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          transform: translateX(-100%) skewX(-10deg);
          transition: transform 0.4s ease;
        }
        .fcard-view-btn:hover::after { transform: translateX(110%) skewX(-10deg); }
        .fcard-view-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45,90,61,0.32);
        }

        .fcard-view-arrow {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fcard-view-btn:hover .fcard-view-arrow { transform: translateX(4px); }

        /* Message button — hidden until hover */
        .fcard-msg-btn {
          width: 42px; height: 42px; flex-shrink: 0;
          background: #f0e8d8; border: 1px solid rgba(101,78,51,0.14);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: #5c4a32; font-size: 14px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          transform: scale(0.7) translateX(8px);
          opacity: 0;
          pointer-events: none;
        }
        .fcard:hover .fcard-msg-btn {
          transform: scale(1) translateX(0);
          opacity: 1;
          pointer-events: auto;
        }
        .fcard-msg-btn:hover {
          background: rgba(74,124,89,0.14);
          border-color: rgba(74,124,89,0.3);
          color: #2d5a3d;
          transform: scale(1.1) !important;
        }
      `}</style>

      <div className="fcard">
        <div className="fcard-top">
          <div
            className="fcard-avatar"
            style={{
              background: `linear-gradient(135deg, hsl(${hue},44%,38%), hsl(${hue},36%,26%))`,
            }}
          >
            <div className="fcard-avatar-ring" />
            {farmer.name?.charAt(0).toUpperCase()}
          </div>
          <div className="fcard-info">
            <div className="fcard-name">{farmer.name}</div>
            {farmer.address && (
              <div className="fcard-location">
                <FaMapMarkerAlt size={10} className="fcard-loc-icon" />
                <span>{farmer.address.city}, {farmer.address.state}</span>
              </div>
            )}
          </div>
        </div>

        <div className="fcard-chips">
          <span className="fcard-chip green">
            <FaLeaf size={8} /> Local Farmer
          </span>
          {farmer.farmerProfile?.acceptsPickup && (
            <span className="fcard-chip">🏡 Pickup</span>
          )}
          {farmer.farmerProfile?.acceptsDelivery && (
            <span className="fcard-chip">🚚 Delivery</span>
          )}
        </div>

        <div className="fcard-divider" />

        <div className="fcard-actions">
          <Link to={`/farmers/${farmer._id}`} className="fcard-view-btn">
            View Farm
            <FaArrowRight size={11} className="fcard-view-arrow" />
          </Link>
          {isAuthenticated && user?.role !== "farmer" && (
            <Link
              to={`/messages/${farmer._id}`}
              className="fcard-msg-btn"
              title="Message farmer"
            >
              <FaComment />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmerCard;