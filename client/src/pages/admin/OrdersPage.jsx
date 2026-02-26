"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import { FaSearch, FaShoppingBasket } from "react-icons/fa";

const FILTERS = ["all", "pending", "accepted", "completed", "rejected", "cancelled"];

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => { dispatch(getAllOrders()); }, [dispatch]);

  const filteredOrders = (adminOrders || []).filter((order) => {
    const matchFilter = filter === "all" || order.status === filter;
    const matchSearch = !searchTerm ||
      order._id.includes(searchTerm) ||
      order.consumer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatus({ id: selectedOrder._id, status: newStatus }));
      setShowStatusModal(false);
    }
  };

  if (loading && adminOrders.length === 0) return <Loader />;

  const chipClass = (f) => {
    if (filter !== f) return "adm-chip";
    if (f === "all") return "adm-chip active-all";
    if (["accepted", "completed"].includes(f)) return "adm-chip active-green";
    if (["rejected", "cancelled"].includes(f)) return "adm-chip active-red";
    if (f === "pending") return "adm-chip active-blue";
    return "adm-chip active-all";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
        .adm-root{font-family:'Jost',sans-serif;background:#f9f5ef;min-height:100vh;padding:40px 2rem 80px}
        .adm-inner{max-width:1280px;margin:0 auto}
        .adm-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:#1e2a1f}
        .adm-subtitle{font-size:.875rem;color:#8a7a65;font-weight:300;margin-top:4px;margin-bottom:32px}
        .adm-toolbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px}
        .adm-search-wrap{position:relative;flex:1;min-width:200px}
        .adm-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#8a7a65;font-size:13px;pointer-events:none}
        .adm-search{width:100%;background:#fefcf8;border:1px solid rgba(101,78,51,.15);border-radius:12px;padding:11px 16px 11px 38px;font-family:'Jost',sans-serif;font-size:.875rem;color:#3d2f1e;outline:none;transition:all .2s ease;box-sizing:border-box}
        .adm-search:focus{border-color:rgba(74,124,89,.4);box-shadow:0 0 0 3px rgba(74,124,89,.08)}
        .adm-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
        .adm-chip{padding:8px 16px;border-radius:100px;font-family:'Jost',sans-serif;font-size:.8rem;font-weight:500;border:1px solid rgba(101,78,51,.15);background:#f4ede0;color:#5c4a32;cursor:pointer;transition:all .2s ease}
        .adm-chip:hover{background:#e5d9c5}
        .adm-chip.active-all{background:linear-gradient(135deg,#4a7c59,#2d5a3d);color:#e8d5b0;border-color:transparent}
        .adm-chip.active-green{background:#4a7c59;color:#e8d5b0;border-color:transparent}
        .adm-chip.active-blue{background:#1a6fa8;color:white;border-color:transparent}
        .adm-chip.active-red{background:#c0392b;color:white;border-color:transparent}
        .adm-order-card{background:#fefcf8;border:1px solid rgba(101,78,51,.1);border-radius:20px;padding:24px;margin-bottom:16px;transition:box-shadow .2s ease}
        .adm-order-card:hover{box-shadow:0 8px 24px rgba(50,35,15,.08)}
        .adm-order-footer{margin-top:16px;padding-top:16px;border-top:1px solid rgba(101,78,51,.08);display:flex;justify-content:flex-end}
        .adm-btn-outline{display:inline-flex;align-items:center;gap:8px;background:#f0e8d8;color:#3d2f1e;border:1px solid rgba(101,78,51,.2);border-radius:12px;padding:10px 20px;font-family:'Jost',sans-serif;font-size:.875rem;cursor:pointer;transition:all .2s ease}
        .adm-btn-outline:hover{background:#e5d9c5}
        .adm-btn-outline:disabled{opacity:.4;cursor:not-allowed}
        .adm-empty{text-align:center;padding:60px 20px;background:#fefcf8;border:1px solid rgba(101,78,51,.1);border-radius:20px}
        .adm-empty-icon{width:72px;height:72px;background:#f0e8d8;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#8a7a65;font-size:26px}
        .adm-empty-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:#3d2f1e;margin-bottom:8px}
        .adm-empty-sub{color:#8a7a65;font-size:.875rem}
        .adm-modal-overlay{position:fixed;inset:0;background:rgba(20,15,8,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
        .adm-modal{background:#fefcf8;border:1px solid rgba(101,78,51,.12);border-radius:24px;padding:32px;max-width:480px;width:100%;box-shadow:0 24px 64px rgba(20,15,8,.25);animation:modalIn .25s ease}
        @keyframes modalIn{from{opacity:0;transform:scale(.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .adm-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#1e2a1f;margin-bottom:8px}
        .adm-modal-desc{font-size:.875rem;color:#8a7a65;font-weight:300;line-height:1.6;margin-bottom:20px}
        .adm-label{display:block;font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#8a7a65;margin-bottom:8px}
        .adm-select{width:100%;background:#f4ede0;border:1px solid rgba(101,78,51,.15);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:.9rem;color:#3d2f1e;outline:none;margin-bottom:24px}
        .adm-modal-actions{display:flex;justify-content:flex-end;gap:10px}
        .adm-btn-primary{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#4a7c59,#2d5a3d);color:#e8d5b0;border:none;border-radius:12px;padding:11px 22px;font-family:'Jost',sans-serif;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .25s ease}
        .adm-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(45,90,61,.35)}
        @media(max-width:640px){.adm-root{padding:24px 1rem 60px}}
      `}</style>

      <div className="adm-root">
        <div className="adm-inner">
          <h1 className="adm-title">All Orders</h1>
          <p className="adm-subtitle">Manage and update order statuses across the platform</p>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <FaSearch className="adm-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID, customer, or farmer..."
                className="adm-search"
              />
            </div>
          </div>

          <div className="adm-chips">
            {FILTERS.map((f) => (
              <button key={f} className={chipClass(f)} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filteredOrders.length > 0 ? (
            <div>
              {filteredOrders.map((order) => (
                <div key={order._id} className="adm-order-card">
                  <OrderItem order={order} />
                  <div className="adm-order-footer">
                    <button
                      className="adm-btn-outline"
                      onClick={() => handleUpdateStatus(order)}
                      disabled={order.status === "completed" || order.status === "cancelled"}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="adm-empty">
              <div className="adm-empty-icon"><FaShoppingBasket /></div>
              <h3 className="adm-empty-title">No Orders Found</h3>
              <p className="adm-empty-sub">
                {filter === "all" && !searchTerm ? "No orders in the system yet." : "No orders match your criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {showStatusModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <h3 className="adm-modal-title">Update Order Status</h3>
            <p className="adm-modal-desc">
              Order #{selectedOrder._id.substring(0, 8)} · {selectedOrder.consumer.name}
            </p>
            <label className="adm-label">New Status</label>
            <select className="adm-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {["pending", "accepted", "rejected", "completed", "cancelled"].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <div className="adm-modal-actions">
              <button className="adm-btn-outline" onClick={() => setShowStatusModal(false)}>Cancel</button>
              <button className="adm-btn-primary" onClick={confirmStatusUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;