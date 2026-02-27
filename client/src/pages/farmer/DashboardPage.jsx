"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProducts } from "../../redux/slices/productSlice";
import { getFarmerOrders } from "../../redux/slices/orderSlice";
import { getConversations } from "../../redux/slices/messageSlice";
import Loader from "../../components/Loader";
import {
  FaBox, FaShoppingCart, FaComment, FaPlus, FaChartLine,
} from "react-icons/fa";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  .fd-root {
    font-family: 'Jost', sans-serif;
    background: #f9f5ef;
    min-height: 100vh;
    padding-bottom: 80px;
  }

  /* ── Hero ── */
  .fd-hero {
    background: linear-gradient(135deg, #1e2a1f, #2d5a3d);
    padding: 52px 2rem 48px;
    position: relative; overflow: hidden;
  }
  .fd-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 80% 50%, rgba(74,124,89,0.22) 0%, transparent 55%),
      radial-gradient(ellipse at 10% 80%, rgba(45,90,61,0.18) 0%, transparent 45%);
  }
  /* subtle grain */
  .fd-hero::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; opacity: 0.4;
  }
  .fd-hero-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 20px; position: relative;
  }
  .fd-hero-eyebrow {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #7db894; margin-bottom: 8px;
  }
  .fd-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 700;
    color: #e8d5b0; line-height: 1.1; margin-bottom: 6px;
  }
  .fd-hero-title em { font-style: italic; color: #7db894; }
  .fd-hero-sub { color: rgba(232,213,176,0.6); font-size: 0.9rem; }

  .fd-add-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #e8d5b0, #d4c09a);
    color: #1e2a1f; border: none; border-radius: 100px;
    padding: 12px 24px; font-family: 'Jost', sans-serif;
    font-size: 0.85rem; font-weight: 600; letter-spacing: 0.03em;
    text-decoration: none; cursor: pointer; flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    transition: all 0.25s ease;
  }
  .fd-add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.35);
    background: linear-gradient(135deg, #f0dfc0, #e8d5b0);
  }

  /* ── Main ── */
  .fd-main { max-width: 1100px; margin: 0 auto; padding: 36px 2rem; }

  /* ── Stat cards ── */
  .fd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 32px;
  }
  .fd-stat {
    background: #fefcf8;
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    position: relative; overflow: hidden;
  }
  .fd-stat:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.09);
  }
  /* coloured top stripe */
  .fd-stat::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px; border-radius: 20px 20px 0 0;
  }
  .fd-stat.green::before  { background: linear-gradient(90deg, #4a7c59, #7db894); }
  .fd-stat.orange::before { background: linear-gradient(90deg, #e07b39, #f0a86a); }
  .fd-stat.blue::before   { background: linear-gradient(90deg, #3a7bd5, #6fa8ef); }
  .fd-stat.gold::before   { background: linear-gradient(90deg, #b8922a, #e8c46a); }

  .fd-stat-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .fd-stat-label {
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.07em;
    text-transform: uppercase; color: #8a7a65;
  }
  .fd-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .fd-stat.green  .fd-stat-icon { background: rgba(74,124,89,0.1);  color: #4a7c59; }
  .fd-stat.orange .fd-stat-icon { background: rgba(224,123,57,0.1); color: #e07b39; }
  .fd-stat.blue   .fd-stat-icon { background: rgba(58,123,213,0.1); color: #3a7bd5; }
  .fd-stat.gold   .fd-stat-icon { background: rgba(184,146,42,0.1); color: #b8922a; }

  .fd-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 700; color: #2d1f0e;
    line-height: 1; margin-bottom: 6px;
  }
  .fd-stat-link {
    font-size: 0.78rem; color: #8a7a65; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px;
    transition: color 0.2s;
  }
  .fd-stat-link:hover { color: #4a7c59; }

  /* ── Cards ── */
  .fd-card {
    background: #fefcf8;
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px; padding: 28px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.03);
    margin-bottom: 20px;
  }
  .fd-card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px; padding-bottom: 14px;
    border-bottom: 1px solid rgba(101,78,51,0.07);
  }
  .fd-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 700; color: #2d1f0e;
  }
  .fd-card-link {
    font-size: 0.8rem; color: #4a7c59; text-decoration: none;
    font-weight: 500; transition: opacity 0.2s;
  }
  .fd-card-link:hover { opacity: 0.75; }

  /* ── Table ── */
  .fd-table { width: 100%; border-collapse: collapse; }
  .fd-table th {
    text-align: left; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #8a7a65; padding: 0 12px 12px;
  }
  .fd-table th:last-child { text-align: right; }
  .fd-table td {
    padding: 13px 12px;
    border-top: 1px solid rgba(101,78,51,0.06);
    font-size: 0.875rem; color: #3d2f1e;
    vertical-align: middle;
  }
  .fd-table td:last-child { text-align: right; }
  .fd-table tr:hover td { background: rgba(74,124,89,0.03); }

  .fd-order-id {
    color: #4a7c59; text-decoration: none; font-weight: 500; font-size: 0.82rem;
    font-family: 'Jost', monospace;
  }
  .fd-order-id:hover { text-decoration: underline; }

  /* Status badge */
  .fd-badge {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 100px;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
    text-transform: capitalize;
  }
  .fd-badge.completed { background: rgba(74,124,89,0.1);  color: #2d5a3d; border: 1px solid rgba(74,124,89,0.22); }
  .fd-badge.pending   { background: rgba(58,123,213,0.1); color: #2350a0; border: 1px solid rgba(58,123,213,0.22); }
  .fd-badge.accepted  { background: rgba(74,124,89,0.1);  color: #2d5a3d; border: 1px solid rgba(74,124,89,0.22); }
  .fd-badge.rejected  { background: rgba(192,57,43,0.1);  color: #922b21; border: 1px solid rgba(192,57,43,0.22); }
  .fd-badge.cancelled { background: rgba(150,150,150,0.1); color: #666; border: 1px solid rgba(150,150,150,0.22); }

  /* Product row */
  .fd-product-img {
    width: 38px; height: 38px; border-radius: 9px;
    object-fit: cover; background: #f0e8d8;
    display: flex; align-items: center; justify-content: center;
    color: #b0a090; font-size: 12px; overflow: hidden;
    flex-shrink: 0;
  }
  .fd-product-cell { display: flex; align-items: center; gap: 12px; }
  .fd-product-name { font-size: 0.875rem; color: #3d2f1e; font-weight: 500; }

  .fd-qty-text.out    { color: #c0392b; font-weight: 600; }
  .fd-qty-text.low    { color: #e07b39; font-weight: 600; }
  .fd-qty-text.medium { color: #b8922a; font-weight: 600; }

  .fd-update-link {
    font-size: 0.8rem; color: #4a7c59; text-decoration: none; font-weight: 500;
  }
  .fd-update-link:hover { text-decoration: underline; }

  /* Empty state */
  .fd-empty {
    text-align: center; padding: 40px 20px;
    color: #8a7a65; font-size: 0.875rem;
  }
  .fd-empty-icon { font-size: 2rem; margin-bottom: 10px; opacity: 0.4; }

  /* 2-col bottom grid */
  .fd-bottom-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }

  @media (max-width: 900px) {
    .fd-stats { grid-template-columns: repeat(2, 1fr); }
    .fd-bottom-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 540px) {
    .fd-stats { grid-template-columns: 1fr; }
    .fd-hero-inner { flex-direction: column; align-items: flex-start; }
  }
`;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { farmerProducts, loading: productsLoading } = useSelector((s) => s.products);
  const { farmerOrders,   loading: ordersLoading }   = useSelector((s) => s.orders);
  const { conversations,  loading: messagesLoading } = useSelector((s) => s.messages);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(getFarmerProducts());
    dispatch(getFarmerOrders());
    dispatch(getConversations());
  }, [dispatch]);

  const orderCounts = {
    pending:   ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "pending").length,
    accepted:  ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "accepted").length,
    completed: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "completed").length,
    rejected:  ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "rejected").length,
    cancelled: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "cancelled").length,
  };

  const unreadMessages = messagesLoading
    ? 0
    : conversations.reduce((t, c) => t + c.unreadCount, 0);

  const totalRevenue = ordersLoading
    ? 0
    : farmerOrders
        .filter((o) => o.status === "completed")
        .reduce((t, o) => t + o.totalAmount, 0);

  const lowStock = farmerProducts.filter((p) => p.quantityAvailable < 10);

  if (productsLoading || ordersLoading || messagesLoading) return <Loader />;

  return (
    <>
      <style>{STYLE}</style>
      <div className="fd-root">

        {/* ── Hero ── */}
        <div className="fd-hero">
          <div className="fd-hero-inner">
            <div>
              <div className="fd-hero-eyebrow">🌱 Farmer Dashboard</div>
              <div className="fd-hero-title">
                Welcome back,<br /><em>{user?.name}!</em>
              </div>
              <div className="fd-hero-sub">Here's what's happening on your farm today.</div>
            </div>
            <Link to="/farmer/products/add" className="fd-add-btn">
              <FaPlus size={12} /> Add New Product
            </Link>
          </div>
        </div>

        <div className="fd-main">

          {/* ── Stat cards ── */}
          <div className="fd-stats">
            <div className="fd-stat green">
              <div className="fd-stat-header">
                <span className="fd-stat-label">Products</span>
                <div className="fd-stat-icon"><FaBox /></div>
              </div>
              <div className="fd-stat-value">{farmerProducts.length}</div>
              <Link to="/farmer/products" className="fd-stat-link">Manage Products →</Link>
            </div>

            <div className="fd-stat orange">
              <div className="fd-stat-header">
                <span className="fd-stat-label">Pending Orders</span>
                <div className="fd-stat-icon"><FaShoppingCart /></div>
              </div>
              <div className="fd-stat-value">{orderCounts.pending}</div>
              <Link to="/farmer/orders" className="fd-stat-link">View All Orders →</Link>
            </div>

            <div className="fd-stat blue">
              <div className="fd-stat-header">
                <span className="fd-stat-label">Unread Messages</span>
                <div className="fd-stat-icon"><FaComment /></div>
              </div>
              <div className="fd-stat-value">{unreadMessages}</div>
              <Link to="/messages" className="fd-stat-link">View Messages →</Link>
            </div>

            <div className="fd-stat gold">
              <div className="fd-stat-header">
                <span className="fd-stat-label">Total Revenue</span>
                <div className="fd-stat-icon"><FaChartLine /></div>
              </div>
              <div className="fd-stat-value" style={{ fontSize: totalRevenue >= 10000 ? "1.6rem" : "2.2rem" }}>
                ₨{totalRevenue.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
              </div>
              <span className="fd-stat-link" style={{ cursor: "default" }}>From completed orders</span>
            </div>
          </div>

          {/* ── Recent Orders ── */}
          <div className="fd-card">
            <div className="fd-card-header">
              <span className="fd-card-title">Recent Orders</span>
              <Link to="/farmer/orders" className="fd-card-link">View All →</Link>
            </div>

            {farmerOrders.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="fd-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmerOrders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link to={`/orders/${order._id}`} className="fd-order-id">
                            #{order._id.substring(0, 8)}
                          </Link>
                        </td>
                        <td>{order.consumer.name}</td>
                        <td style={{ color: "#8a7a65" }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`fd-badge ${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>₨{order.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="fd-empty">
                <div className="fd-empty-icon">🛒</div>
                No orders yet.
              </div>
            )}
          </div>

          {/* ── Low Stock ── */}
          <div className="fd-card">
            <div className="fd-card-header">
              <span className="fd-card-title">Low Stock Products</span>
              <Link to="/farmer/products" className="fd-card-link">Manage Inventory →</Link>
            </div>

            {lowStock.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="fd-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty Left</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.slice(0, 5).map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="fd-product-cell">
                            <div className="fd-product-img">
                              {product.images?.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <FaBox />
                              )}
                            </div>
                            <span className="fd-product-name">{product.name}</span>
                          </div>
                        </td>
                        <td>₨{product.price.toFixed(2)}</td>
                        <td>
                          <span className={`fd-qty-text ${product.quantityAvailable === 0 ? "out" : product.quantityAvailable < 5 ? "low" : "medium"}`}>
                            {product.quantityAvailable} {product.unit}
                          </span>
                        </td>
                        <td>
                          <Link to={`/farmer/products/edit/${product._id}`} className="fd-update-link">
                            Update Stock →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="fd-empty">
                <div className="fd-empty-icon">✅</div>
                No low stock products.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default DashboardPage;