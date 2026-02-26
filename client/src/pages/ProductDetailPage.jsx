"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, clearProductDetails } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import { FaLeaf, FaShoppingCart, FaMapMarkerAlt, FaUser, FaComment, FaArrowLeft, FaPhone } from "react-icons/fa";
import { placeholder } from "../assets";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems, farmerId } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProductDetails(id));
    return () => dispatch(clearProductDetails());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (user.role === "farmer") { alert("Farmers cannot place orders."); return; }
    if (farmerId && farmerId !== product.farmer._id && cartItems.length > 0) {
      if (!confirm("Your cart has items from another farm. Clear cart and add this item?")) return;
    }
    dispatch(addToCart({ product, quantity }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!message.trim()) return;
    dispatch(sendMessage({ receiver: product.farmer._id, content: message }));
    setMessage("");
    setShowMessageForm(false);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  if (loading) return <Loader />;

  if (error) return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", fontFamily: "'Jost', sans-serif" }}>
      <p style={{ color: "#c0392b", marginBottom: 16 }}>{error}</p>
      <Link to="/products" style={{ color: "#4a7c59" }}>← Back to Products</Link>
    </div>
  );

  if (!product) return <Loader />;

  const images = product.images && product.images.length > 0 ? product.images : [placeholder];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .pdp-root {
          font-family: 'Jost', sans-serif;
          background: #f9f5ef;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .pdp-breadcrumb {
          background: #fefcf8;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
          padding: 16px 2rem;
        }

        .pdp-breadcrumb-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #8a7a65;
        }

        .pdp-back {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #5c4a32;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .pdp-back:hover { color: #4a7c59; }

        .pdp-sep { color: rgba(101, 78, 51, 0.3); }

        .pdp-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 2rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        /* Gallery */
        .pdp-gallery {}

        .pdp-main-img {
          background: #f0e8d8;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 1;
          position: relative;
          margin-bottom: 12px;
        }

        .pdp-main-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .pdp-main-img:hover img { transform: scale(1.03); }

        .pdp-organic-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(45, 90, 61, 0.92);
          backdrop-filter: blur(8px);
          color: #c8e6c9;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 7px 14px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pdp-thumbnails {
          display: flex;
          gap: 10px;
        }

        .pdp-thumb {
          flex: 1;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          background: #f0e8d8;
        }

        .pdp-thumb.active { border-color: #4a7c59; }
        .pdp-thumb:hover { border-color: rgba(74, 124, 89, 0.5); }
        .pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* Info panel */
        .pdp-info {}

        .pdp-category {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(74, 124, 89, 0.1);
          color: #2d5a3d;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          margin-bottom: 16px;
        }

        .pdp-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1e2a1f;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .pdp-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin: 20px 0;
        }

        .pdp-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #2d5a3d;
        }

        .pdp-unit {
          font-size: 1rem;
          color: #8a7a65;
          font-weight: 300;
        }

        .pdp-desc {
          color: #5c4a32;
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.75;
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
        }

        .pdp-meta {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }

        .pdp-meta-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: #5c4a32;
        }

        .pdp-meta-icon {
          width: 30px;
          height: 30px;
          background: rgba(74, 124, 89, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a7c59;
          font-size: 12px;
          flex-shrink: 0;
        }

        .pdp-meta-label { font-weight: 500; color: #3d2f1e; }

        /* Farmer card */
        .pdp-farmer {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.12);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 28px;
        }

        .pdp-farmer-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .pdp-farmer-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8d5b0;
          font-size: 18px;
        }

        .pdp-farmer-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e2a1f;
        }

        .pdp-farmer-role {
          font-size: 0.78rem;
          color: #8a7a65;
          font-weight: 400;
        }

        .pdp-farmer-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 12px;
          border-top: 1px solid rgba(101, 78, 51, 0.08);
        }

        .pdp-farmer-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #8a7a65;
        }

        .pdp-farmer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          text-decoration: none;
          color: #4a7c59;
          font-size: 0.85rem;
          font-weight: 500;
          transition: gap 0.2s ease;
        }

        .pdp-farmer-link:hover { gap: 10px; }

        /* Cart section */
        .pdp-cart {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .pdp-qty-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pdp-qty-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #8a7a65;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .pdp-qty-input {
          width: 90px;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e2a1f;
          outline: none;
          text-align: center;
          transition: border-color 0.2s ease;
        }

        .pdp-qty-input:focus {
          border-color: rgba(74, 124, 89, 0.5);
        }

        .pdp-add-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 14px;
          padding: 14px 28px;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(45, 90, 61, 0.3);
        }

        .pdp-add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45, 90, 61, 0.4);
        }

        .pdp-add-btn:disabled {
          background: #c8b99a;
          box-shadow: none;
          cursor: not-allowed;
        }

        .pdp-add-btn.added {
          background: linear-gradient(135deg, #2d5a3d, #1a3d28);
        }

        /* Message section */
        .pdp-msg-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid rgba(74, 124, 89, 0.3);
          border-radius: 12px;
          padding: 11px 20px;
          color: #4a7c59;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          justify-content: center;
        }

        .pdp-msg-btn:hover {
          background: rgba(74, 124, 89, 0.08);
          border-color: rgba(74, 124, 89, 0.5);
        }

        .pdp-msg-form {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.12);
          border-radius: 18px;
          padding: 20px;
        }

        .pdp-msg-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 500;
          color: #5c4a32;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .pdp-msg-textarea {
          width: 100%;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          resize: vertical;
          min-height: 90px;
          margin-bottom: 12px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .pdp-msg-textarea:focus { border-color: rgba(74, 124, 89, 0.4); }

        .pdp-msg-actions { display: flex; gap: 10px; }

        .pdp-msg-send {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pdp-msg-send:hover { transform: translateY(-1px); }

        .pdp-msg-cancel {
          background: #f0e8d8;
          color: #5c4a32;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 10px;
          padding: 10px 22px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        @media (max-width: 768px) {
          .pdp-main { grid-template-columns: 1fr; gap: 32px; padding: 24px 1rem 0; }
        }
      `}</style>

      <div className="pdp-root">
        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <div className="pdp-breadcrumb-inner">
            <Link to="/products" className="pdp-back">
              <FaArrowLeft size={11} /> Back to Products
            </Link>
            <span className="pdp-sep">/</span>
            <span>{product.name}</span>
          </div>
        </div>

        <div className="pdp-main">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-img">
              <img
                src={images[activeImage]}
                alt={product.name}
                onError={handleImageError}
              />
              {product.isOrganic && (
                <span className="pdp-organic-badge">
                  <FaLeaf size={10} /> Organic
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="pdp-thumbnails">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`pdp-thumb ${activeImage === i ? "active" : ""}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} onError={handleImageError} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pdp-info">
            <span className="pdp-category">
              <FaLeaf size={9} /> {product.category?.name || "Fresh Produce"}
            </span>

            <h1 className="pdp-name">{product.name}</h1>

            <div className="pdp-price-wrap">
              <span className="pdp-price">₹{product.price.toFixed(2)}</span>
              <span className="pdp-unit">per {product.unit}</span>
            </div>

            <p className="pdp-desc">{product.description}</p>

            <div className="pdp-meta">
              <div className="pdp-meta-item">
                <div className="pdp-meta-icon"><FaLeaf /></div>
                <span>
                  <span className="pdp-meta-label">Available: </span>
                  {product.quantityAvailable} {product.unit}
                </span>
              </div>
              {product.harvestDate && (
                <div className="pdp-meta-item">
                  <div className="pdp-meta-icon">🌾</div>
                  <span>
                    <span className="pdp-meta-label">Harvested: </span>
                    {new Date(product.harvestDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            {/* Farmer Card */}
            {product.farmer && (
              <div className="pdp-farmer">
                <div className="pdp-farmer-header">
                  <div className="pdp-farmer-avatar"><FaUser /></div>
                  <div>
                    <div className="pdp-farmer-name">{product.farmer.name}</div>
                    <div className="pdp-farmer-role">Local Farmer</div>
                  </div>
                </div>
                <div className="pdp-farmer-details">
                  {product.farmer.address && (
                    <div className="pdp-farmer-detail">
                      <FaMapMarkerAlt size={11} style={{ color: "#4a7c59" }} />
                      {product.farmer.address.city}, {product.farmer.address.state}
                    </div>
                  )}
                  {product.farmer.phone && (
                    <div className="pdp-farmer-detail">
                      <FaPhone size={11} style={{ color: "#4a7c59" }} />
                      {product.farmer.phone}
                    </div>
                  )}
                </div>
                <Link to={`/farmers/${product.farmer._id}`} className="pdp-farmer-link">
                  View Farm Profile →
                </Link>
              </div>
            )}

            {/* Add to Cart */}
            {user?.role !== "farmer" && (
              <div className="pdp-cart">
                <div className="pdp-qty-wrap">
                  <span className="pdp-qty-label">Qty</span>
                  <input
                    type="number"
                    min="1"
                    max={product.quantityAvailable}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="pdp-qty-input"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantityAvailable === 0}
                  className={`pdp-add-btn ${addedToCart ? "added" : ""}`}
                >
                  <FaShoppingCart size={14} />
                  {product.quantityAvailable === 0
                    ? "Out of Stock"
                    : addedToCart
                    ? "Added! ✓"
                    : "Add to Cart"}
                </button>
              </div>
            )}

            {/* Message Farmer */}
            {isAuthenticated && user?.role !== "farmer" && (
              <div>
                {showMessageForm ? (
                  <div className="pdp-msg-form">
                    <label className="pdp-msg-label">Message to Farmer</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pdp-msg-textarea"
                      placeholder="Ask about this product, availability, or custom orders..."
                    />
                    <div className="pdp-msg-actions">
                      <button onClick={handleSendMessage} className="pdp-msg-send">Send Message</button>
                      <button onClick={() => setShowMessageForm(false)} className="pdp-msg-cancel">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowMessageForm(true)} className="pdp-msg-btn">
                    <FaComment size={13} /> Message the Farmer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;