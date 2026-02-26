"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../redux/slices/orderSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaArrowLeft,
  FaLeaf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaComment,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

const STATUS_STYLES = {
  pending: { bg: "rgba(74, 90, 139, 0.12)", color: "#3a4a8b", border: "rgba(74, 90, 139, 0.25)" },
  accepted: { bg: "rgba(74, 124, 89, 0.12)", color: "#2d5a3d", border: "rgba(74, 124, 89, 0.25)" },
  completed: { bg: "rgba(74, 124, 89, 0.12)", color: "#2d5a3d", border: "rgba(74, 124, 89, 0.25)" },
  rejected: { bg: "rgba(139, 58, 58, 0.1)", color: "#8b2020", border: "rgba(139, 58, 58, 0.25)" },
  cancelled: { bg: "rgba(139, 58, 58, 0.1)", color: "#8b2020", border: "rgba(139, 58, 58, 0.25)" },
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { order, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const receiverId = user.role === "consumer" ? order.farmer._id : order.consumer._id;
    dispatch(sendMessage({ receiver: receiverId, content: message, relatedOrder: id }));
    setMessage("");
    setShowMessageForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading || !order) return <Loader />;

  const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .odp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
        }

        .odp-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #4a7c59;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          padding: 32px 2rem 0;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
        }

        .odp-back:hover { color: #2d5a3d; }

        .odp-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 2rem 80px;
        }

        /* Page header */
        .odp-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .odp-order-id {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          color: #1e2a1f;
          margin-bottom: 6px;
        }

        .odp-order-date {
          color: #8a7a65;
          font-size: 0.875rem;
          font-weight: 300;
        }

        .odp-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: capitalize;
          border: 1px solid;
        }

        /* Cards */
        .odp-card {
          background: #fefcf8;
          border: 1px solid rgba(101, 78, 51, 0.1);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 20px;
        }

        .odp-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #1e2a1f;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
        }

        .odp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .odp-grid-2 { grid-template-columns: 1fr; }
        }

        .odp-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid rgba(101, 78, 51, 0.07);
          font-size: 0.875rem;
        }

        .odp-detail-row:last-child { border-bottom: none; }

        .odp-detail-label { color: #8a7a65; }
        .odp-detail-value { color: #3d2f1e; font-weight: 500; }

        .odp-detail-big {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e2a1f;
        }

        .odp-contact-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f4ede0;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 10px;
          font-size: 0.875rem;
          color: #3d2f1e;
          font-weight: 400;
          line-height: 1.5;
        }

        .odp-contact-row:last-child { margin-bottom: 0; }
        .odp-contact-row svg { color: #4a7c59; margin-top: 2px; flex-shrink: 0; }

        .odp-person-name {
          font-weight: 600;
          color: #1e2a1f;
          font-size: 0.95rem;
          margin-bottom: 3px;
        }

        .odp-person-detail {
          color: #8a7a65;
          font-size: 0.82rem;
        }

        /* Table */
        .odp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .odp-th {
          text-align: left;
          padding: 10px 12px;
          font-weight: 500;
          color: #8a7a65;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid rgba(101, 78, 51, 0.12);
        }

        .odp-th:not(:first-child) { text-align: center; }
        .odp-th:last-child { text-align: right; }

        .odp-td {
          padding: 14px 12px;
          color: #3d2f1e;
          border-bottom: 1px solid rgba(101, 78, 51, 0.07);
          vertical-align: middle;
        }

        .odp-td:not(:first-child) { text-align: center; }
        .odp-td:last-child { text-align: right; font-weight: 600; }

        .odp-product-img {
          width: 52px;
          height: 52px;
          background: #f0e8d8;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 12px;
        }

        .odp-product-name { font-weight: 500; color: #1e2a1f; }

        .odp-table-total {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 24px;
          padding: 16px 12px 0;
          border-top: 1px solid rgba(101, 78, 51, 0.12);
          margin-top: 4px;
          font-weight: 600;
          color: #1e2a1f;
          font-size: 1rem;
        }

        /* Message section */
        .odp-msg-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 12px;
          padding: 12px 22px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
        }

        .odp-msg-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45, 90, 61, 0.3);
        }

        .odp-textarea {
          width: 100%;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          resize: vertical;
          margin-bottom: 14px;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .odp-textarea:focus {
          border-color: rgba(74, 124, 89, 0.4);
          background: #fefcf8;
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.08);
        }

        .odp-form-actions { display: flex; gap: 10px; }

        .odp-btn-send {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }

        .odp-btn-cancel {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: #6b5c45;
          border: 1px solid rgba(101, 78, 51, 0.2);
          border-radius: 10px;
          padding: 11px 20px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .odp-btn-cancel:hover { background: #f0e8d8; }
      `}</style>

      <div className="odp-root">
        <Link to={`/${user.role === "farmer" ? "farmer/" : ""}orders`} className="odp-back">
          <FaArrowLeft size={12} /> Back to Orders
        </Link>

        <div className="odp-inner">
          {/* Page header */}
          <div className="odp-page-header">
            <div>
              <h1 className="odp-order-id">Order #{order._id.substring(0, 8)}</h1>
              <p className="odp-order-date">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div
              className="odp-status-badge"
              style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>

          {/* Order info + Delivery/Pickup */}
          <div className="odp-grid-2">
            <div className="odp-card">
              <h2 className="odp-card-title">Order Details</h2>
              <div>
                <div className="odp-detail-row">
                  <span className="odp-detail-label">Total Amount</span>
                  <span className="odp-detail-value odp-detail-big">₨{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="odp-detail-row">
                  <span className="odp-detail-label">Payment Method</span>
                  <span className="odp-detail-value" style={{ textTransform: "capitalize" }}>
                    {order.paymentMethod.replace("_", " ")}
                  </span>
                </div>
                {order.notes && (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "#f4ede0", borderRadius: 10, fontSize: "0.875rem", color: "#6b5c45", fontWeight: 300, lineHeight: 1.6 }}>
                    {order.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="odp-card">
              <h2 className="odp-card-title">
                {order.pickupDetails?.location ? "Pickup Details" : "Delivery Details"}
              </h2>
              {order.pickupDetails?.location ? (
                <>
                  <div className="odp-contact-row">
                    <FaMapMarkerAlt size={13} />
                    <span>{order.pickupDetails.location}</span>
                  </div>
                  {order.pickupDetails.date && (
                    <div className="odp-contact-row">
                      <FaCalendarAlt size={13} />
                      <span>{formatDate(order.pickupDetails.date)}</span>
                    </div>
                  )}
                  {order.pickupDetails.time && (
                    <div className="odp-contact-row">
                      <FaClock size={13} />
                      <span>{order.pickupDetails.time}</span>
                    </div>
                  )}
                </>
              ) : order.deliveryDetails?.address ? (
                <>
                  <div className="odp-contact-row">
                    <FaMapMarkerAlt size={13} />
                    <div>
                      <div>{order.deliveryDetails.address.street}</div>
                      <div>{order.deliveryDetails.address.city}, {order.deliveryDetails.address.state} {order.deliveryDetails.address.zipCode}</div>
                    </div>
                  </div>
                  {order.deliveryDetails.date && (
                    <div className="odp-contact-row">
                      <FaCalendarAlt size={13} />
                      <span>{formatDate(order.deliveryDetails.date)}</span>
                    </div>
                  )}
                  {order.deliveryDetails.time && (
                    <div className="odp-contact-row">
                      <FaClock size={13} />
                      <span>{order.deliveryDetails.time}</span>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "#8a7a65", fontSize: "0.875rem", fontStyle: "italic" }}>No details provided.</p>
              )}
            </div>
          </div>

          {/* Customer + Farmer info */}
          <div className="odp-grid-2">
            <div className="odp-card">
              <h2 className="odp-card-title">Customer Information</h2>
              <p className="odp-person-name">{order.consumer.name}</p>
              <p className="odp-person-detail">{order.consumer.email}</p>
              {order.consumer.phone && <p className="odp-person-detail">{order.consumer.phone}</p>}
            </div>
            <div className="odp-card">
              <h2 className="odp-card-title">Farmer Information</h2>
              <p className="odp-person-name">{order.farmer.name}</p>
              <p className="odp-person-detail">{order.farmer.email}</p>
              {order.farmer.phone && <p className="odp-person-detail">{order.farmer.phone}</p>}
            </div>
          </div>

          {/* Order items */}
          <div className="odp-card">
            <h2 className="odp-card-title">Order Items</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="odp-table">
                <thead>
                  <tr>
                    <th className="odp-th">Product</th>
                    <th className="odp-th">Price</th>
                    <th className="odp-th">Qty</th>
                    <th className="odp-th">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td className="odp-td">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="odp-product-img">
                            {item.product.images?.length > 0 ? (
                              <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <FaLeaf style={{ color: "#4a7c59", fontSize: 18 }} />
                            )}
                          </div>
                          <span className="odp-product-name">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="odp-td">₨{item.price.toFixed(2)}</td>
                      <td className="odp-td">{item.quantity}</td>
                      <td className="odp-td">₨{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="odp-table-total">
                <span style={{ color: "#8a7a65", fontWeight: 400 }}>Total</span>
                <span>₨{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Contact section */}
          <div className="odp-card">
            <h2 className="odp-card-title">
              Contact {user.role === "consumer" ? "Farmer" : "Customer"}
            </h2>
            {showMessageForm ? (
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="odp-textarea"
                  placeholder={`Write your message to the ${user.role === "consumer" ? "farmer" : "customer"}...`}
                  rows="4"
                  required
                />
                <div className="odp-form-actions">
                  <button type="submit" className="odp-btn-send">
                    <FaPaperPlane size={12} /> Send Message
                  </button>
                  <button type="button" className="odp-btn-cancel" onClick={() => setShowMessageForm(false)}>
                    <FaTimes size={12} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowMessageForm(true)} className="odp-msg-btn">
                <FaComment size={13} />
                Send a message about this order
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;