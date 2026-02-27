import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { placeholder } from "../assets";
import { FaLeaf, FaShoppingCart, FaEye } from "react-icons/fa";
import { useState, useRef } from "react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      unit: product.unit,
      farmerId: product.farmer?._id || product.farmer,
      farmerName: product.farmer?.name || "",
      farmerUpiId: product.farmer?.upiId || "",
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .pcard {
          font-family: 'Jost', sans-serif;
          background: #fefcf8;
          border: 1px solid rgba(101,78,51,0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.42s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.4s ease,
                      border-color 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .pcard:hover {
          transform: translateY(-9px);
          box-shadow: 0 28px 56px rgba(50,35,15,0.16);
          border-color: rgba(74,124,89,0.25);
        }

        /* Image area */
        .pcard-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f0e8d8;
        }

        .pcard-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .pcard:hover .pcard-img { transform: scale(1.09); }

        /* Slide-up action overlay */
        .pcard-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
            rgba(15,28,17,0.95) 0%,
            rgba(15,28,17,0.5) 55%,
            transparent 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 14px;
          gap: 8px;
          transform: translateY(100%);
          transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
        }
        .pcard:hover .pcard-overlay { transform: translateY(0); }

        .pcard-ov-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px 8px;
          border-radius: 11px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          border: none; cursor: pointer;
          transition: all 0.2s;
          position: relative; overflow: hidden;
          text-decoration: none;
          letter-spacing: 0.02em;
        }

        .pcard-ov-view {
          background: rgba(255,255,255,0.12);
          color: #e8d5b0;
          border: 1px solid rgba(232,213,176,0.2);
          backdrop-filter: blur(6px);
        }
        .pcard-ov-view:hover { background: rgba(255,255,255,0.22); }

        .pcard-ov-cart {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          box-shadow: 0 2px 8px rgba(45,90,61,0.4);
        }
        .pcard-ov-cart:hover { opacity: 0.9; transform: scale(1.02); }
        .pcard-ov-cart.added { background: linear-gradient(135deg, #2d5a3d, #1a2f20); }

        /* Ripple */
        .pcard-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          transform: scale(0);
          animation: pcard-ripple 0.65s ease-out forwards;
          pointer-events: none;
          width: 80px; height: 80px;
          margin-left: -40px; margin-top: -40px;
        }
        @keyframes pcard-ripple {
          to { transform: scale(4); opacity: 0; }
        }

        /* Organic badge */
        .pcard-organic {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(45,90,61,0.88);
          backdrop-filter: blur(6px);
          color: #c8e6c9;
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 10px; border-radius: 100px;
          display: flex; align-items: center; gap: 5px;
          z-index: 2;
        }

        .pcard-category {
          position: absolute;
          bottom: 12px; left: 12px;
          background: rgba(250,246,240,0.9);
          backdrop-filter: blur(6px);
          color: #5c4a32;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 5px 10px; border-radius: 100px;
          z-index: 2;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
        }
        .pcard:hover .pcard-category {
          transform: translateY(-8px);
        }

        /* Body */
        .pcard-body { padding: 18px 20px 20px; }

        .pcard-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 600;
          color: #2d3a2e; margin-bottom: 5px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          line-height: 1.3;
        }

        .pcard-farmer {
          font-size: 0.78rem; color: #8a7a65; font-weight: 400;
          margin-bottom: 14px; letter-spacing: 0.02em;
        }

        .pcard-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 14px;
          border-top: 1px solid rgba(101,78,51,0.08);
        }

        .pcard-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 700; color: #2d5a3d;
        }
        .pcard-unit { font-size: 0.75rem; color: #8a7a65; font-weight: 400; }

        .pcard-btn {
          text-decoration: none;
          background: #f0e8d8;
          color: #3d2f1e; font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.04em; padding: 8px 16px;
          border-radius: 100px; transition: all 0.25s ease;
          border: 1px solid rgba(101,78,51,0.15);
        }
        .pcard-btn:hover {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0; border-color: transparent;
          transform: translateX(2px);
        }
      `}</style>

      <div className="pcard">
        {/* Image */}
        <div className="pcard-img-wrap">
          <img
            src={product.images?.length > 0 ? product.images[0] : placeholder}
            alt={product.name}
            onError={handleImageError}
            className="pcard-img"
          />
          {product.isOrganic && (
            <span className="pcard-organic"><FaLeaf size={8} /> Organic</span>
          )}
          {product.category?.name && (
            <span className="pcard-category">{product.category.name}</span>
          )}

          {/* Slide-up hover overlay */}
          <div className="pcard-overlay">
            <Link to={`/products/${product._id}`} className="pcard-ov-btn pcard-ov-view">
              <FaEye size={11} /> View
            </Link>
            <button
              className={`pcard-ov-btn pcard-ov-cart ${added ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {ripples.map((r) => (
                <span key={r.id} className="pcard-ripple" style={{ left: r.x, top: r.y }} />
              ))}
              <FaShoppingCart size={11} />
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="pcard-body">
          <h3 className="pcard-name">{product.name}</h3>
          {product.farmer?.name && (
            <p className="pcard-farmer">by {product.farmer.name}</p>
          )}
          <div className="pcard-footer">
            <div>
              <span className="pcard-price">₹{product.price.toFixed(2)}</span>
              <span className="pcard-unit"> / {product.unit}</span>
            </div>
            <Link to={`/products/${product._id}`} className="pcard-btn">View →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;