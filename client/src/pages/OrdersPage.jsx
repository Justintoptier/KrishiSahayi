"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumerOrders } from "../redux/slices/orderSlice";
import OrderItem from "../components/OrderItem";
import Loader from "../components/Loader";
import { FaShoppingBasket, FaLeaf } from "react-icons/fa";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
];

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getConsumerOrders());
  }, [dispatch]);

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .op-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
        }

        .op-hero {
          background: linear-gradient(135deg, #1e2a1f 0%, #2d3a2e 60%, #1a2e20 100%);
          padding: 56px 2rem 48px;
          position: relative;
          overflow: hidden;
        }

        .op-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse at 75% 40%, rgba(74, 124, 89, 0.2) 0%, transparent 60%);
        }

        .op-hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
        }

        .op-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 124, 89, 0.2);
          border: 1px solid rgba(74, 124, 89, 0.3);
          color: #7db894;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
        }

        .op-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #e8d5b0;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .op-title em { font-style: italic; color: #7db894; }

        .op-subtitle {
          color: #8a7a65;
          font-size: 0.95rem;
          font-weight: 300;
        }

        /* Filter bar */
        .op-filter-bar {
          background: #fefcf8;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
          padding: 16px 2rem;
          position: sticky;
          top: 72px;
          z-index: 40;
        }

        .op-filter-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .op-chip {
          padding: 8px 18px;
          border-radius: 100px;
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(101, 78, 51, 0.15);
          background: #f0e8d8;
          color: #5c4a32;
          transition: all 0.2s ease;
        }

        .op-chip:hover,
        .op-chip.active {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border-color: transparent;
        }

        .op-chip.active-rejected,
        .op-chip.active-cancelled {
          background: linear-gradient(135deg, #8b3a3a, #6b2a2a);
          color: #f0d0d0;
          border-color: transparent;
        }

        .op-chip.active-pending {
          background: linear-gradient(135deg, #5a6b8b, #3a4a6b);
          color: #d0d8f0;
          border-color: transparent;
        }

        /* Main */
        .op-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 2rem 80px;
        }

        .op-count {
          font-size: 0.8rem;
          color: #8a7a65;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .op-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .op-empty {
          text-align: center;
          padding: 80px 20px;
          background: #fefcf8;
          border-radius: 20px;
          border: 1px solid rgba(101, 78, 51, 0.1);
        }

        .op-empty-icon {
          width: 80px;
          height: 80px;
          background: #f0e8d8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #8a7a65;
          font-size: 28px;
        }

        .op-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #3d2f1e;
          margin-bottom: 8px;
        }

        .op-empty-sub {
          color: #8a7a65;
          font-size: 0.9rem;
          font-weight: 300;
        }
      `}</style>

      <div className="op-root">
        <div className="op-hero">
          <div className="op-hero-inner">
            <div className="op-eyebrow">
              <FaShoppingBasket size={10} /> Your History
            </div>
            <h1 className="op-title">My <em>Orders</em></h1>
            <p className="op-subtitle">Track and manage all your purchases.</p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="op-filter-bar">
          <div className="op-filter-inner">
            {STATUS_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`op-chip ${filter === key ? (
                  key === "rejected" || key === "cancelled" ? "active-rejected" :
                  key === "pending" ? "active-pending" : "active"
                ) : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="op-main">
          {filteredOrders.length > 0 ? (
            <>
              <p className="op-count">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</p>
              <div className="op-list">
                {filteredOrders.map((order) => (
                  <OrderItem key={order._id} order={order} />
                ))}
              </div>
            </>
          ) : (
            <div className="op-empty">
              <div className="op-empty-icon"><FaShoppingBasket /></div>
              <h3 className="op-empty-title">No Orders Found</h3>
              <p className="op-empty-sub">
                {filter === "all"
                  ? "You haven't placed any orders yet."
                  : `You don't have any ${filter} orders.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;