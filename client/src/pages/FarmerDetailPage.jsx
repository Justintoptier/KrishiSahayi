"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  clearFarmerProfile,
} from "../redux/slices/farmerSlice";
import { getProducts } from "../redux/slices/productSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaComment,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFarmerProfile(id));
    dispatch(getProducts({ farmer: id }));
    return () => { dispatch(clearFarmerProfile()); };
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!message.trim()) return;
    dispatch(sendMessage({ receiver: id, content: message }));
    setMessage("");
    setShowMessageForm(false);
  };

  if (loading || productsLoading) return <Loader />;

  if (!farmerProfile) {
    return (
      <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#f9f5ef", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ color: "#8a7a65", fontSize: "1.1rem" }}>Farmer not found.</p>
        <Link to="/farmers" style={{ color: "#4a7c59", textDecoration: "none", fontWeight: 500 }}>← Back to Farmers</Link>
      </div>
    );
  }

  const { farmer, profile } = farmerProfile;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .fdp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
        }

        .fdp-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #4a7c59;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          padding: 32px 2rem 0;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
        }

        .fdp-back:hover { color: #2d5a3d; }

        .fdp-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 2rem 80px;
        }

        /* Profile card */
        .fdp-profile {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.1);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 28px;
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        @media (max-width: 768px) {
          .fdp-profile { flex-direction: column; align-items: center; text-align: center; }
        }

        .fdp-avatar {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #2d5a3d, #4a7c59);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(45, 90, 61, 0.25);
        }

        .fdp-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 700;
          color: #1e2a1f;
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .fdp-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        .fdp-meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #6b5c45;
          font-size: 0.875rem;
          font-weight: 400;
        }

        .fdp-meta-item svg { color: #4a7c59; }

        .fdp-desc {
          color: #6b5c45;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }

        .fdp-social {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .fdp-social a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0e8d8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3d2f1e;
          transition: all 0.2s;
          text-decoration: none;
        }

        .fdp-social a:hover {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
        }

        .fdp-msg-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 12px;
          padding: 11px 22px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .fdp-msg-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45, 90, 61, 0.3);
        }

        /* Message form */
        .fdp-msg-form {
          margin-top: 16px;
          background: #f4ede0;
          border-radius: 16px;
          padding: 20px;
        }

        .fdp-textarea {
          width: 100%;
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.2);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          resize: vertical;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .fdp-textarea:focus {
          border-color: rgba(74, 124, 89, 0.4);
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.08);
        }

        .fdp-form-actions {
          display: flex;
          gap: 10px;
        }

        .fdp-btn-send {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fdp-btn-cancel {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: #6b5c45;
          border: 1px solid rgba(101, 78, 51, 0.2);
          border-radius: 10px;
          padding: 10px 18px;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fdp-btn-cancel:hover { background: #f0e8d8; }

        /* Info panels row */
        .fdp-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }

        @media (max-width: 768px) { .fdp-panels { grid-template-columns: 1fr; } }

        .fdp-panel {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.1);
          border-radius: 20px;
          padding: 28px;
        }

        .fdp-panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e2a1f;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
        }

        .fdp-practice {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #6b5c45;
          font-size: 0.875rem;
          margin-bottom: 10px;
          font-weight: 400;
          line-height: 1.5;
        }

        .fdp-practice svg { color: #4a7c59; margin-top: 2px; flex-shrink: 0; }

        .fdp-hours-row {
          display: flex;
          justify-content: space-between;
          padding: 7px 0;
          border-bottom: 1px solid rgba(101, 78, 51, 0.07);
          font-size: 0.875rem;
          color: #6b5c45;
        }

        .fdp-hours-row:last-child { border-bottom: none; }

        .fdp-hours-day { font-weight: 500; color: #3d2f1e; text-transform: capitalize; }

        /* Products section */
        .fdp-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e2a1f;
          margin-bottom: 24px;
        }

        .fdp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .fdp-empty {
          text-align: center;
          padding: 60px 20px;
          background: #fefcf8;
          border-radius: 20px;
          border: 1px solid rgba(101, 78, 51, 0.1);
        }

        .fdp-empty p { color: #8a7a65; font-size: 0.9rem; font-weight: 300; }

        .fdp-year-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(74, 124, 89, 0.1);
          border: 1px solid rgba(74, 124, 89, 0.2);
          color: #2d5a3d;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 100px;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="fdp-root">
        <Link to="/farmers" className="fdp-back">
          <FaArrowLeft size={12} /> Back to Farmers
        </Link>

        <div className="fdp-inner">
          {/* Profile card */}
          <div className="fdp-profile">
            <div className="fdp-avatar">
              <FaLeaf style={{ color: "#e8d5b0", fontSize: 40 }} />
            </div>

            <div style={{ flex: 1 }}>
              <h1 className="fdp-name">{profile?.farmName || farmer.name}</h1>

              {profile?.establishedYear && (
                <div className="fdp-year-badge">
                  <FaCalendarAlt size={10} /> Est. {profile.establishedYear}
                </div>
              )}

              <div className="fdp-meta">
                {farmer.address && (
                  <span className="fdp-meta-item">
                    <FaMapMarkerAlt size={12} />
                    {farmer.address.city}, {farmer.address.state}
                  </span>
                )}
                {farmer.phone && (
                  <span className="fdp-meta-item">
                    <FaPhone size={12} /> {farmer.phone}
                  </span>
                )}
                <span className="fdp-meta-item">
                  <FaEnvelope size={12} /> {farmer.email}
                </span>
              </div>

              {profile?.description && (
                <p className="fdp-desc">{profile.description}</p>
              )}

              {profile?.socialMedia && (
                <div className="fdp-social">
                  {profile.socialMedia.facebook && (
                    <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <FaFacebook size={15} />
                    </a>
                  )}
                  {profile.socialMedia.instagram && (
                    <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram size={15} />
                    </a>
                  )}
                  {profile.socialMedia.twitter && (
                    <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter size={15} />
                    </a>
                  )}
                </div>
              )}

              {isAuthenticated && user?.role !== "farmer" && (
                <>
                  {showMessageForm ? (
                    <div className="fdp-msg-form">
                      <form onSubmit={handleSendMessage}>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="fdp-textarea"
                          placeholder="Write your message here..."
                          rows="3"
                          required
                        />
                        <div className="fdp-form-actions">
                          <button type="submit" className="fdp-btn-send">
                            <FaPaperPlane size={12} /> Send Message
                          </button>
                          <button type="button" className="fdp-btn-cancel" onClick={() => setShowMessageForm(false)}>
                            <FaTimes size={12} /> Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <button className="fdp-msg-btn" onClick={() => setShowMessageForm(true)}>
                      <FaComment size={13} /> Message Farmer
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Info panels */}
          {profile && (profile.farmingPractices?.length > 0 || profile.businessHours) && (
            <div className="fdp-panels">
              {profile.farmingPractices?.length > 0 && (
                <div className="fdp-panel">
                  <h2 className="fdp-panel-title">Farming Practices</h2>
                  {profile.farmingPractices.map((practice, i) => (
                    <div key={i} className="fdp-practice">
                      <FaLeaf size={12} />
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              )}

              {profile.businessHours && (
                <div className="fdp-panel">
                  <h2 className="fdp-panel-title">Business Hours</h2>
                  {Object.entries(profile.businessHours).map(([day, hours]) =>
                    hours.open && hours.close ? (
                      <div key={day} className="fdp-hours-row">
                        <span className="fdp-hours-day">{day}</span>
                        <span>{hours.open} – {hours.close}</span>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}

          {/* Products */}
          <h2 className="fdp-section-title">Available Products</h2>
          {products.length > 0 ? (
            <div className="fdp-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="fdp-empty">
              <FaLeaf style={{ color: "#4a7c59", fontSize: 32, margin: "0 auto 16px", display: "block" }} />
              <p>This farmer doesn't have any products listed at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmerDetailPage;