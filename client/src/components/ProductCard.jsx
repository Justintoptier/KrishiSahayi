import { Link } from "react-router-dom";
import { placeholder } from "../assets";
import { FaLeaf } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .pcard {
          font-family: 'Jost', sans-serif;
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          cursor: pointer;
        }

        .pcard:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(50, 35, 15, 0.14);
          border-color: rgba(74, 124, 89, 0.2);
        }

        .pcard-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f0e8d8;
        }

        .pcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .pcard:hover .pcard-img {
          transform: scale(1.06);
        }

        .pcard-organic {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(45, 90, 61, 0.9);
          backdrop-filter: blur(8px);
          color: #c8e6c9;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .pcard-category {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(250, 246, 240, 0.9);
          backdrop-filter: blur(8px);
          color: #5c4a32;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 100px;
        }

        .pcard-body {
          padding: 18px 20px 20px;
        }

        .pcard-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3a2e;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .pcard-farmer {
          font-size: 0.78rem;
          color: #8a7a65;
          font-weight: 400;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }

        .pcard-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid rgba(101, 78, 51, 0.08);
        }

        .pcard-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d5a3d;
        }

        .pcard-unit {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          color: #8a7a65;
          font-weight: 400;
        }

        .pcard-btn {
          text-decoration: none;
          background: #f0e8d8;
          color: #3d2f1e;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 8px 16px;
          border-radius: 100px;
          transition: all 0.25s ease;
          border: 1px solid rgba(101, 78, 51, 0.15);
        }

        .pcard-btn:hover {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border-color: transparent;
          transform: translateX(2px);
        }
      `}</style>

      <div className="pcard">
        <div className="pcard-img-wrap">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : placeholder}
            alt={product.name}
            onError={handleImageError}
            className="pcard-img"
          />
          {product.isOrganic && (
            <span className="pcard-organic">
              <FaLeaf size={9} /> Organic
            </span>
          )}
          {product.category?.name && (
            <span className="pcard-category">{product.category.name}</span>
          )}
        </div>

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
            <Link to={`/products/${product._id}`} className="pcard-btn">
              View →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;