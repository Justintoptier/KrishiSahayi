"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllOrders } from "../../redux/slices/orderSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import { getProducts } from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import { FaUsers, FaList, FaBox } from "react-icons/fa";
import { FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { adminOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { products, loading: productsLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllOrders());
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  const userCounts = {
    total: users.length,
    farmers: users.filter((u) => u.role === "farmer").length,
    consumers: users.filter((u) => u.role === "consumer").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const orderCounts = {
    total: adminOrders.length,
    pending: adminOrders.filter((o) => o.status === "pending").length,
    accepted: adminOrders.filter((o) => o.status === "accepted").length,
    completed: adminOrders.filter((o) => o.status === "completed").length,
    rejected: adminOrders.filter((o) => o.status === "rejected").length,
    cancelled: adminOrders.filter((o) => o.status === "cancelled").length,
  };

  const totalRevenue = adminOrders
    .filter((o) => o.status === "completed")
    .reduce((t, o) => t + o.totalAmount, 0);

  const statusBadge = (status) => {
    const map = {
      pending: "adm-badge adm-badge-blue",
      accepted: "adm-badge adm-badge-green",
      completed: "adm-badge adm-badge-green",
      rejected: "adm-badge adm-badge-red",
      cancelled: "adm-badge adm-badge-red",
    };
    return map[status] || "adm-badge adm-badge-gray";
  };

  if (usersLoading || ordersLoading || categoriesLoading || productsLoading) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
        .adm-root { font-family: 'Jost', sans-serif; background: #f9f5ef; min-height: 100vh; padding: 40px 2rem 80px; }
        .adm-inner { max-width: 1280px; margin: 0 auto; }
        .adm-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: #1e2a1f; }
        .adm-subtitle { font-size: 0.875rem; color: #8a7a65; font-weight: 300; margin-top: 4px; }
        .adm-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 32px; }
        .adm-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 32px; }
        .adm-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; }
        .adm-stat { background: #fefcf8; border: 1px solid rgba(101,78,51,0.1); border-radius: 20px; padding: 24px; transition: all 0.25s ease; }
        .adm-stat:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(50,35,15,0.1); }
        .adm-stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .adm-stat-label { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #8a7a65; }
        .adm-stat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .adm-stat-value { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: #1e2a1f; line-height: 1; margin-bottom: 8px; }
        .adm-stat-link { font-size: 0.8rem; color: #4a7c59; text-decoration: none; font-weight: 500; }
        .adm-stat-link:hover { color: #2d5a3d; }
        .adm-card { background: #fefcf8; border: 1px solid rgba(101,78,51,0.1); border-radius: 20px; padding: 28px; margin-bottom: 32px; }
        .adm-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .adm-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: #1e2a1f; }
        .adm-link { color: #4a7c59; text-decoration: none; font-size: 0.85rem; font-weight: 500; }
        .adm-stat-mini { background: #faf6f0; border: 1px solid rgba(101,78,51,0.08); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
        .adm-stat-mini-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .adm-stat-mini-label { font-size: 0.78rem; color: #8a7a65; font-weight: 400; }
        .adm-stat-mini-value { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: #1e2a1f; line-height: 1.1; }
        .adm-order-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; }
        .adm-order-stat { background: #faf6f0; border-radius: 14px; padding: 16px; text-align: center; border: 1px solid rgba(101,78,51,0.08); }
        .adm-order-stat-label { font-size: 0.75rem; color: #8a7a65; font-weight: 500; letter-spacing: 0.04em; margin-bottom: 8px; text-transform: uppercase; }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-table thead { background: #f4ede0; }
        .adm-table th { padding: 12px 16px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7a65; text-align: left; }
        .adm-table th.right { text-align: right; }
        .adm-table th.center { text-align: center; }
        .adm-table td { padding: 14px 16px; font-size: 0.875rem; color: #3d2f1e; border-bottom: 1px solid rgba(101,78,51,0.06); }
        .adm-table td.right { text-align: right; }
        .adm-table td.center { text-align: center; }
        .adm-table tbody tr:hover { background: #faf6f0; }
        .adm-table tbody tr:last-child td { border-bottom: none; }
        .adm-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 600; }
        .adm-badge-green { background: rgba(74,124,89,0.12); color: #2d5a3d; }
        .adm-badge-blue { background: rgba(52,152,219,0.12); color: #1a6fa8; }
        .adm-badge-red { background: rgba(192,57,43,0.12); color: #c0392b; }
        .adm-badge-gray { background: rgba(101,78,51,0.08); color: #8a7a65; }
        @media(max-width:1024px){.adm-grid-4{grid-template-columns:repeat(2,1fr)}.adm-grid-3{grid-template-columns:repeat(2,1fr)}.adm-order-stats{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:640px){.adm-grid-4,.adm-grid-3,.adm-grid-2{grid-template-columns:1fr}.adm-order-stats{grid-template-columns:repeat(2,1fr)}.adm-root{padding:24px 1rem 60px}}
      `}</style>

      <div className="adm-root">
        <div className="adm-inner">
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <h1 className="adm-title">Admin Dashboard</h1>
            <p className="adm-subtitle">Overview of your platform's performance</p>
          </div>

          {/* Top Stats */}
          <div className="adm-grid-4">
            {[
              { label: "Total Users", value: userCounts.total - userCounts.admins, icon: <FaUsers />, iconBg: "rgba(52,152,219,0.1)", iconColor: "#2980b9", link: "/admin/users", linkText: "Manage Users →" },
              { label: "Total Orders", value: orderCounts.total, icon: <FaShoppingCart />, iconBg: "rgba(230,126,34,0.1)", iconColor: "#c0622a", link: "/admin/orders", linkText: "View Orders →" },
              { label: "Categories", value: categories.length, icon: <FaList />, iconBg: "rgba(142,68,173,0.1)", iconColor: "#7d3c98", link: "/admin/categories", linkText: "Manage →" },
              { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: <FaMoneyBillWave />, iconBg: "rgba(74,124,89,0.1)", iconColor: "#4a7c59", link: null, linkText: "From completed orders" },
            ].map((s, i) => (
              <div className="adm-stat" key={i}>
                <div className="adm-stat-header">
                  <span className="adm-stat-label">{s.label}</span>
                  <div className="adm-stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
                </div>
                <div className="adm-stat-value">{s.value}</div>
                {s.link
                  ? <Link to={s.link} className="adm-stat-link">{s.linkText}</Link>
                  : <span style={{ fontSize: "0.78rem", color: "#8a7a65" }}>{s.linkText}</span>
                }
              </div>
            ))}
          </div>

          {/* User Stats */}
          <div className="adm-card">
            <div className="adm-card-header">
              <h2 className="adm-card-title">User Breakdown</h2>
              <Link to="/admin/users" className="adm-link">View All →</Link>
            </div>
            <div className="adm-grid-3">
              {[
                { label: "Farmers", value: userCounts.farmers, icon: <GiFarmer />, bg: "rgba(74,124,89,0.1)", color: "#4a7c59" },
                { label: "Consumers", value: userCounts.consumers, icon: <FaUsers />, bg: "rgba(52,152,219,0.1)", color: "#2980b9" },
                { label: "Admins", value: userCounts.admins, icon: <FaUsers />, bg: "rgba(142,68,173,0.1)", color: "#7d3c98" },
              ].map((s, i) => (
                <div className="adm-stat-mini" key={i}>
                  <div className="adm-stat-mini-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                  <div>
                    <div className="adm-stat-mini-label">{s.label}</div>
                    <div className="adm-stat-mini-value">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Stats */}
          <div className="adm-card">
            <div className="adm-card-header">
              <h2 className="adm-card-title">Order Statistics</h2>
              <Link to="/admin/orders" className="adm-link">View All →</Link>
            </div>
            <div className="adm-order-stats">
              {[
                { label: "Pending", value: orderCounts.pending, color: "#1a6fa8" },
                { label: "Accepted", value: orderCounts.accepted, color: "#4a7c59" },
                { label: "Completed", value: orderCounts.completed, color: "#2d5a3d" },
                { label: "Rejected", value: orderCounts.rejected, color: "#c0392b" },
                { label: "Cancelled", value: orderCounts.cancelled, color: "#8a7a65" },
              ].map((s, i) => (
                <div className="adm-order-stat" key={i}>
                  <div className="adm-order-stat-label">{s.label}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tables */}
          <div className="adm-grid-2">
            {/* Recent Orders */}
            <div className="adm-card" style={{ marginBottom: 0 }}>
              <div className="adm-card-header">
                <h2 className="adm-card-title">Recent Orders</h2>
                <Link to="/admin/orders" className="adm-link">View All →</Link>
              </div>
              {adminOrders.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th className="center">Status</th>
                        <th className="right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOrders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td>
                            <Link to={`/orders/${order._id}`} className="adm-link">
                              #{order._id.substring(0, 8)}
                            </Link>
                          </td>
                          <td>{order.consumer.name}</td>
                          <td className="center">
                            <span className={statusBadge(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="right" style={{ fontWeight: 600 }}>₹{order.totalAmount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "#8a7a65", textAlign: "center", padding: "20px 0", fontSize: "0.875rem" }}>No orders yet.</p>
              )}
            </div>

            {/* Recent Products */}
            <div className="adm-card" style={{ marginBottom: 0 }}>
              <div className="adm-card-header">
                <h2 className="adm-card-title">Recent Products</h2>
                <Link to="/products" className="adm-link">View All →</Link>
              </div>
              {products.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Farmer</th>
                        <th className="center">Price</th>
                        <th className="right">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0e8d8", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {product.images?.length > 0
                                  ? <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <FaBox style={{ color: "#8a7a65", fontSize: 12 }} />
                                }
                              </div>
                              <Link to={`/products/${product._id}`} className="adm-link">{product.name}</Link>
                            </div>
                          </td>
                          <td style={{ color: "#8a7a65" }}>{product.farmer?.name}</td>
                          <td className="center">₹{product.price.toFixed(2)}</td>
                          <td className="right">
                            <span style={{ color: product.quantityAvailable === 0 ? "#c0392b" : product.quantityAvailable < 5 ? "#c0622a" : "#4a7c59", fontWeight: 600 }}>
                              {product.quantityAvailable} {product.unit}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "#8a7a65", textAlign: "center", padding: "20px 0", fontSize: "0.875rem" }}>No products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;