"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import { FaShoppingBasket } from "react-icons/fa";

const FILTERS = ["all", "pending", "accepted", "completed", "rejected", "cancelled"];

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  .fo-root { font-family: 'Jost', sans-serif; background: #f9f5ef; min-height: 100vh; padding-bottom: 80px; }

  .fo-hero {
    background: linear-gradient(135deg, #1e2a1f, #2d5a3d);
    padding: 110px 2rem 44px; position: relative; overflow: hidden;
  }
  .fo-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 75% 50%, rgba(74,124,89,0.2) 0%, transparent 55%);
  }
  .fo-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; }
  .fo-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(74,124,89,0.2); border: 1px solid rgba(74,124,89,0.3);
    color: #7db894; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 5px 13px; border-radius: 100px; margin-bottom: 14px;
  }
  .fo-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 700;
    color: #e8d5b0; line-height: 1.1; margin-bottom: 6px;
  }
  .fo-title em { font-style: italic; color: #7db894; }
  .fo-subtitle { color: rgba(232,213,176,0.6); font-size: 0.88rem; }

  .fo-main { max-width: 1100px; margin: 0 auto; padding: 32px 2rem; }

  .fo-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
  .fo-chip {
    padding: 8px 18px; border-radius: 100px;
    font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500;
    border: 1px solid rgba(101,78,51,0.15); background: #f4ede0;
    color: #5c4a32; cursor: pointer; transition: all 0.2s ease;
  }
  .fo-chip:hover { background: #e5d9c5; }
  .fo-chip.active-all { background: linear-gradient(135deg,#4a7c59,#2d5a3d); color: #e8d5b0; border-color: transparent; }
  .fo-chip.active-green { background: #4a7c59; color: #e8d5b0; border-color: transparent; }
  .fo-chip.active-blue { background: #1a6fa8; color: white; border-color: transparent; }
  .fo-chip.active-red { background: #c0392b; color: white; border-color: transparent; }

  .fo-card {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px; padding: 24px; margin-bottom: 14px;
    transition: box-shadow 0.2s ease;
  }
  .fo-card:hover { box-shadow: 0 8px 24px rgba(50,35,15,0.08); }
  .fo-card-footer {
    margin-top: 16px; padding-top: 16px;
    border-top: 1px solid rgba(101,78,51,0.08);
    display: flex; justify-content: flex-end;
  }
  .fo-btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: #f0e8d8; color: #3d2f1e;
    border: 1px solid rgba(101,78,51,0.2); border-radius: 12px;
    padding: 10px 20px; font-family: 'Jost', sans-serif;
    font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;
  }
  .fo-btn-outline:hover { background: #e5d9c5; }
  .fo-btn-outline:disabled { opacity: 0.4; cursor: not-allowed; }

  .fo-empty {
    text-align: center; padding: 70px 20px;
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1); border-radius: 20px;
  }
  .fo-empty-icon {
    width: 72px; height: 72px; background: #f0e8d8; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: #8a7a65; font-size: 26px;
  }
  .fo-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: #3d2f1e; margin-bottom: 8px; }
  .fo-empty-sub { color: #8a7a65; font-size: 0.875rem; }

  .fo-modal-overlay {
    position: fixed; inset: 0; background: rgba(20,15,8,0.6);
    backdrop-filter: blur(4px); display: flex;
    align-items: center; justify-content: center; z-index: 100; padding: 20px;
  }
  .fo-modal {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.12);
    border-radius: 24px; padding: 32px; max-width: 460px; width: 100%;
    box-shadow: 0 24px 64px rgba(20,15,8,0.25); animation: modalIn 0.22s ease;
  }
  @keyframes modalIn { from { opacity:0; transform:scale(0.92) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .fo-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: #1e2a1f; margin-bottom: 6px; }
  .fo-modal-desc { font-size: 0.875rem; color: #8a7a65; margin-bottom: 20px; line-height: 1.6; }
  .fo-modal-label { display: block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8a7a65; margin-bottom: 8px; }
  .fo-modal-select {
    width: 100%; background: #f4ede0; border: 1px solid rgba(101,78,51,0.15);
    border-radius: 12px; padding: 12px 16px; font-family: 'Jost', sans-serif;
    font-size: 0.9rem; color: #3d2f1e; outline: none; margin-bottom: 24px;
  }
  .fo-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
  .fo-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #4a7c59, #2d5a3d); color: #e8d5b0;
    border: none; border-radius: 12px; padding: 11px 22px;
    font-family: 'Jost', sans-serif; font-size: 0.875rem; font-weight: 500;
    cursor: pointer; transition: all 0.25s ease;
  }
  .fo-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(45,90,61,0.35); }
`;

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { farmerOrders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => { dispatch(getFarmerOrders()); }, [dispatch]);

  const filteredOrders = filter === "all"
    ? farmerOrders
    : farmerOrders.filter((o) => o.status === filter);

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

  const chipClass = (f) => {
    if (filter !== f) return "fo-chip";
    if (f === "all") return "fo-chip active-all";
    if (["accepted", "completed"].includes(f)) return "fo-chip active-green";
    if (["rejected", "cancelled"].includes(f)) return "fo-chip active-red";
    if (f === "pending") return "fo-chip active-blue";
    return "fo-chip active-all";
  };

  if (loading) return <Loader />;

  return (
    <>
      <style>{STYLE}</style>
      <div className="fo-root">
        <div className="fo-hero">
          <div className="fo-hero-inner">
            <div className="fo-eyebrow">📦 Orders</div>
            <h1 className="fo-title">Manage <em>Orders</em></h1>
            <p className="fo-subtitle">Review and update your incoming orders.</p>
          </div>
        </div>

        <div className="fo-main">
          <div className="fo-chips">
            {FILTERS.map((f) => (
              <button key={f} className={chipClass(f)} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="fo-card">
                <OrderItem order={order} />
                <div className="fo-card-footer">
                  <button
                    className="fo-btn-outline"
                    onClick={() => handleUpdateStatus(order)}
                    disabled={order.status === "completed" || order.status === "cancelled"}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="fo-empty">
              <div className="fo-empty-icon"><FaShoppingBasket /></div>
              <h3 className="fo-empty-title">No Orders Found</h3>
              <p className="fo-empty-sub">
                {filter === "all" ? "You don't have any orders yet." : `No ${filter} orders found.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {showStatusModal && (
        <div className="fo-modal-overlay">
          <div className="fo-modal">
            <h3 className="fo-modal-title">Update Order Status</h3>
            <p className="fo-modal-desc">
              Order #{selectedOrder._id.substring(0, 8)} · {selectedOrder.consumer.name}
            </p>
            <label className="fo-modal-label">New Status</label>
            <select className="fo-modal-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {["pending", "accepted", "rejected", "completed", "cancelled"].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <div className="fo-modal-actions">
              <button className="fo-btn-outline" onClick={() => setShowStatusModal(false)}>Cancel</button>
              <button className="fo-btn-primary" onClick={confirmStatusUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;