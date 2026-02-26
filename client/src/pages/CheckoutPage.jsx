"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart, updateCartQuantity, clearCart,
} from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/orderSlice";
import { FaArrowLeft, FaLeaf, FaTrash, FaShoppingBasket } from "react-icons/fa";
import Loader from "../components/Loader";
import UPIPaymentmodal from "../components/UPIpaymentmodal";
import { placeholder } from "../assets";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  .cp-root { font-family: 'Jost', sans-serif; background: #f9f5ef; min-height: 100vh; padding-bottom: 80px; }

  .cp-hero {
    background: linear-gradient(135deg, #1e2a1f, #2d5a3d);
    padding: 48px 2rem 44px; position: relative; overflow: hidden;
  }
  .cp-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 75% 50%, rgba(74,124,89,0.22) 0%, transparent 55%);
  }
  .cp-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; }

  .cp-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    color: rgba(232,213,176,0.6); font-size: 0.82rem; font-weight: 400;
    cursor: pointer; background: none; border: none; margin-bottom: 20px;
    font-family: 'Jost', sans-serif; transition: color 0.2s; padding: 0;
  }
  .cp-back-btn:hover { color: #e8d5b0; }

  .cp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    font-weight: 700; color: #e8d5b0; margin-bottom: 6px;
  }
  .cp-title em { font-style: italic; color: #7db894; }

  .cp-farmer-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(74,124,89,0.18); border: 1px solid rgba(74,124,89,0.28);
    color: #7db894; border-radius: 100px; padding: 5px 14px;
    font-size: 0.78rem; font-weight: 500;
  }

  .cp-main { max-width: 1100px; margin: 0 auto; padding: 32px 2rem; }

  .cp-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }

  .cp-card {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1);
    border-radius: 18px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  }

  .cp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 700; color: #2d1f0e;
    margin-bottom: 20px; padding-bottom: 14px;
    border-bottom: 1px solid rgba(101,78,51,0.08);
  }

  /* Cart items */
  .cp-item {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 0; border-bottom: 1px solid rgba(101,78,51,0.08);
  }
  .cp-item:last-child { border-bottom: none; }

  .cp-item-img {
    width: 64px; height: 64px; border-radius: 12px; overflow: hidden;
    background: #f0e8d8; flex-shrink: 0;
  }
  .cp-item-img img { width: 100%; height: 100%; object-fit: cover; }

  .cp-item-info { flex: 1; }
  .cp-item-name { font-weight: 500; color: #2d1f0e; font-size: 0.95rem; margin-bottom: 3px; }
  .cp-item-price { color: #4a7c59; font-size: 0.85rem; font-weight: 500; }

  .cp-item-controls { display: flex; align-items: center; gap: 16px; }

  .cp-qty-input {
    width: 64px; background: #f4ede0;
    border: 1px solid rgba(101,78,51,0.15); border-radius: 8px;
    padding: 7px 10px; font-family: 'Jost', sans-serif;
    font-size: 0.88rem; color: #3d2f1e; outline: none; text-align: center;
  }

  .cp-item-total { font-weight: 600; color: #2d1f0e; font-size: 0.95rem; min-width: 60px; text-align: right; }

  .cp-remove-btn {
    background: none; border: none; color: #c0806a; cursor: pointer;
    font-size: 14px; transition: color 0.2s;
  }
  .cp-remove-btn:hover { color: #a05040; }

  .cp-cart-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(101,78,51,0.08);
  }

  .cp-clear-btn {
    background: none; border: none; color: #c0806a; font-family: 'Jost', sans-serif;
    font-size: 0.82rem; cursor: pointer; transition: color 0.2s;
  }
  .cp-clear-btn:hover { color: #a05040; }

  .cp-cart-total {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 700; color: #2d1f0e;
  }
  .cp-cart-total span { font-size: 1rem; color: #4a7c59; }

  /* Form */
  .cp-section { margin-bottom: 22px; }

  .cp-section-label {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #8a7a65; margin-bottom: 12px;
    display: block;
  }

  .cp-radio-group { display: flex; gap: 12px; }

  .cp-radio-option {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: #f4ede0; border: 1.5px solid transparent; border-radius: 10px;
    padding: 11px 16px; cursor: pointer; transition: all 0.2s;
    font-size: 0.88rem; color: #5c4a32; font-weight: 500;
  }
  .cp-radio-option.selected { border-color: #4a7c59; background: rgba(74,124,89,0.08); color: #2d5a3d; }
  .cp-radio-option input { display: none; }

  .cp-input {
    width: 100%; background: #f4ede0;
    border: 1px solid rgba(101,78,51,0.15); border-radius: 10px;
    padding: 11px 14px; font-family: 'Jost', sans-serif;
    font-size: 0.88rem; color: #3d2f1e; outline: none; transition: all 0.2s;
    box-sizing: border-box; margin-bottom: 10px;
  }
  .cp-input:focus { border-color: rgba(74,124,89,0.4); background: #fefcf8; }
  .cp-input::placeholder { color: #b0a090; }

  .cp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .cp-select {
    width: 100%; background: #f4ede0;
    border: 1px solid rgba(101,78,51,0.15); border-radius: 10px;
    padding: 11px 14px; font-family: 'Jost', sans-serif;
    font-size: 0.88rem; color: #3d2f1e; outline: none; cursor: pointer;
    transition: all 0.2s; box-sizing: border-box;
  }
  .cp-select:focus { border-color: rgba(74,124,89,0.4); }

  .cp-textarea {
    width: 100%; background: #f4ede0;
    border: 1px solid rgba(101,78,51,0.15); border-radius: 10px;
    padding: 11px 14px; font-family: 'Jost', sans-serif;
    font-size: 0.88rem; color: #3d2f1e; outline: none; resize: vertical;
    transition: all 0.2s; box-sizing: border-box;
  }
  .cp-textarea:focus { border-color: rgba(74,124,89,0.4); background: #fefcf8; }

  .cp-upi-hint {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(74,124,89,0.08); border: 1px solid rgba(74,124,89,0.2);
    border-radius: 10px; padding: 10px 14px; margin-top: 10px;
    font-size: 0.82rem; color: #2d5a3d;
  }

  .cp-submit {
    width: 100%;
    background: linear-gradient(135deg, #4a7c59, #2d5a3d);
    color: #e8d5b0; border: none; border-radius: 12px; padding: 15px;
    font-family: 'Jost', sans-serif; font-size: 1rem; font-weight: 600;
    letter-spacing: 0.04em; cursor: pointer; transition: all 0.25s; margin-top: 8px;
  }
  .cp-submit:hover { opacity: 0.9; box-shadow: 0 6px 20px rgba(45,90,61,0.3); transform: translateY(-1px); }
  .cp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .cp-empty {
    max-width: 480px; margin: 80px auto; text-align: center; padding: 0 24px;
  }
  .cp-empty-icon {
    width: 80px; height: 80px; background: #f0e8d8; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: #8a7a65; font-size: 28px;
  }
  .cp-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; color: #2d1f0e; margin-bottom: 8px;
  }
  .cp-empty-sub { color: #8a7a65; font-size: 0.9rem; font-weight: 300; margin-bottom: 28px; }
  .cp-browse-btn {
    display: inline-block; background: linear-gradient(135deg, #4a7c59, #2d5a3d);
    color: #e8d5b0; border-radius: 12px; padding: 12px 28px;
    font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600;
    border: none; cursor: pointer; transition: all 0.2s; text-decoration: none;
  }
  .cp-browse-btn:hover { opacity: 0.9; }

  @media (max-width: 768px) { .cp-grid { grid-template-columns: 1fr; } }
`;

const CheckoutPage = () => {
  const [orderType, setOrderType] = useState("pickup");
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    pickupDetails: { date: "", time: "", location: "" },
    deliveryDetails: { address: { street: "", city: "", state: "", zipCode: "" }, date: "", time: "" },
    paymentMethod: "cash",
    notes: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, farmerId, farmerName, farmerUpiId } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, success, order } = useSelector((state) => state.orders);

  useEffect(() => {
    if (success && order) navigate(`/orders/${order._id}`);
  }, [success, order, navigate]);

  useEffect(() => {
    if (user?.address) {
      setOrderDetails((prev) => ({
        ...prev,
        deliveryDetails: {
          ...prev.deliveryDetails,
          address: {
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            zipCode: user.address.zipCode || "",
          },
        },
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 3) {
        const [p, c, g] = parts;
        setOrderDetails({ ...orderDetails, [p]: { ...orderDetails[p], [c]: { ...orderDetails[p][c], [g]: value } } });
      } else {
        const [p, c] = parts;
        setOrderDetails({ ...orderDetails, [p]: { ...orderDetails[p], [c]: value } });
      }
    } else {
      setOrderDetails({ ...orderDetails, [name]: value });
    }
  };

  const calculateTotal = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const buildOrderData = () => {
    const d = {
      farmer: farmerId,
      items: cartItems.map((i) => ({ product: i.productId, quantity: i.quantity, price: i.price })),
      notes: orderDetails.notes,
      paymentMethod: orderDetails.paymentMethod,
    };
    if (orderType === "pickup") d.pickupDetails = orderDetails.pickupDetails;
    else d.deliveryDetails = orderDetails.deliveryDetails;
    return d;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (orderDetails.paymentMethod === "upi") {
      setPendingOrderData(buildOrderData());
      setShowUPIModal(true);
      return;
    }
    dispatch(createOrder(buildOrderData()));
  };

  const handleUPISuccess = () => { if (pendingOrderData) dispatch(createOrder(pendingOrderData)); };

  const handleImageError = (e) => { e.target.onerror = null; e.target.src = placeholder; };

  if (loading) return <Loader />;

  if (cartItems.length === 0) {
    return (
      <>
        <style>{STYLE}</style>
        <div className="cp-root">
          <div className="cp-empty">
            <div className="cp-empty-icon"><FaShoppingBasket /></div>
            <h2 className="cp-empty-title">Your Cart is Empty</h2>
            <p className="cp-empty-sub">Add some fresh produce from local farmers to get started.</p>
            <button onClick={() => navigate("/products")} className="cp-browse-btn">Browse Products</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLE}</style>
      <div className="cp-root">
        <UPIPaymentmodal
          isOpen={showUPIModal}
          onClose={() => setShowUPIModal(false)}
          onSuccess={handleUPISuccess}
          amount={calculateTotal()}
          farmerName={farmerName}
          farmerUpiId={farmerUpiId}
          cartItems={cartItems}
        />

        {/* Hero */}
        <div className="cp-hero">
          <div className="cp-hero-inner">
            <button onClick={() => navigate(-1)} className="cp-back-btn">
              <FaArrowLeft size={11} /> Back
            </button>
            <h1 className="cp-title"><em>Checkout</em></h1>
            <div className="cp-farmer-badge">
              <FaLeaf size={10} /> Ordering from {farmerName}
            </div>
          </div>
        </div>

        <div className="cp-main">
          <div className="cp-grid">
            {/* Cart section */}
            <div className="cp-card">
              <div className="cp-card-title">Your Cart</div>
              {cartItems.map((item) => (
                <div key={item.productId} className="cp-item">
                  <div className="cp-item-img">
                    <img
                      src={item.image || placeholder}
                      alt={item.name}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="cp-item-info">
                    <div className="cp-item-name">{item.name}</div>
                    <div className="cp-item-price">₹{item.price.toFixed(2)} each</div>
                  </div>
                  <div className="cp-item-controls">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => dispatch(updateCartQuantity({ productId: item.productId, quantity: parseInt(e.target.value) }))}
                      className="cp-qty-input"
                    />
                    <div className="cp-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => dispatch(removeFromCart(item.productId))} className="cp-remove-btn">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              <div className="cp-cart-footer">
                <button onClick={() => dispatch(clearCart())} className="cp-clear-btn">
                  Clear cart
                </button>
                <div className="cp-cart-total">
                  <span>Total </span>₹{calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="cp-card">
              <div className="cp-card-title">Order Details</div>
              <form onSubmit={handleSubmit}>
                {/* Order type */}
                <div className="cp-section">
                  <span className="cp-section-label">Fulfillment Method</span>
                  <div className="cp-radio-group">
                    <label className={`cp-radio-option ${orderType === "pickup" ? "selected" : ""}`}>
                      <input type="radio" value="pickup" checked={orderType === "pickup"} onChange={() => setOrderType("pickup")} />
                      🏡 Pickup
                    </label>
                    <label className={`cp-radio-option ${orderType === "delivery" ? "selected" : ""}`}>
                      <input type="radio" value="delivery" checked={orderType === "delivery"} onChange={() => setOrderType("delivery")} />
                      🚚 Delivery
                    </label>
                  </div>
                </div>

                {/* Fields */}
                <div className="cp-section">
                  <span className="cp-section-label">{orderType === "pickup" ? "Pickup" : "Delivery"} Details</span>
                  {orderType === "pickup" ? (
                    <>
                      <input type="text" name="pickupDetails.location" value={orderDetails.pickupDetails.location} onChange={handleInputChange} className="cp-input" placeholder="Pickup location / farm address" required />
                      <div className="cp-grid-2">
                        <input type="date" name="pickupDetails.date" value={orderDetails.pickupDetails.date} onChange={handleInputChange} className="cp-input" required />
                        <input type="time" name="pickupDetails.time" value={orderDetails.pickupDetails.time} onChange={handleInputChange} className="cp-input" required />
                      </div>
                    </>
                  ) : (
                    <>
                      <input type="text" name="deliveryDetails.address.street" value={orderDetails.deliveryDetails.address.street} onChange={handleInputChange} className="cp-input" placeholder="Street address" required />
                      <div className="cp-grid-2">
                        <input type="text" name="deliveryDetails.address.city" value={orderDetails.deliveryDetails.address.city} onChange={handleInputChange} className="cp-input" placeholder="City" required />
                        <input type="text" name="deliveryDetails.address.state" value={orderDetails.deliveryDetails.address.state} onChange={handleInputChange} className="cp-input" placeholder="State" required />
                      </div>
                      <input type="text" name="deliveryDetails.address.zipCode" value={orderDetails.deliveryDetails.address.zipCode} onChange={handleInputChange} className="cp-input" placeholder="ZIP Code" required />
                      <div className="cp-grid-2">
                        <input type="date" name="deliveryDetails.date" value={orderDetails.deliveryDetails.date} onChange={handleInputChange} className="cp-input" required />
                        <input type="time" name="deliveryDetails.time" value={orderDetails.deliveryDetails.time} onChange={handleInputChange} className="cp-input" required />
                      </div>
                    </>
                  )}
                </div>

                {/* Payment */}
                <div className="cp-section">
                  <span className="cp-section-label">Payment Method</span>
                  <select name="paymentMethod" value={orderDetails.paymentMethod} onChange={handleInputChange} className="cp-select" required>
                    <option value="cash">Cash on Pickup / Delivery</option>
                    <option value="upi">UPI Payment (Scan QR)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                  {orderDetails.paymentMethod === "upi" && (
                    <div className="cp-upi-hint">
                      <span>📱</span>
                      <span>A QR code will appear after placing the order. Pay via GPay, PhonePe, or Paytm.</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="cp-section">
                  <span className="cp-section-label">Notes (Optional)</span>
                  <textarea name="notes" rows="3" value={orderDetails.notes} onChange={handleInputChange} className="cp-textarea" placeholder="Special instructions or requests…" />
                </div>

                <button type="submit" className="cp-submit" disabled={loading}>
                  {loading ? "Processing…" : orderDetails.paymentMethod === "upi" ? "Pay with UPI →" : "Place Order →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;