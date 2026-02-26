"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSearch, FaLeaf } from "react-icons/fa";

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);

  useEffect(() => {
    dispatch(getAllFarmers());
  }, [dispatch]);

  useEffect(() => {
    if (farmers) {
      setFilteredFarmers(
        farmers.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmers, searchTerm]);

  if (loading) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .fp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
        }

        .fp-hero {
          background: linear-gradient(135deg, #1e2a1f 0%, #2d3a2e 60%, #1a2e20 100%);
          padding: 72px 2rem 64px;
          position: relative;
          overflow: hidden;
        }

        .fp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse at 30% 50%, rgba(74, 124, 89, 0.25) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 80%, rgba(139, 105, 20, 0.12) 0%, transparent 50%);
        }

        .fp-hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
        }

        .fp-eyebrow {
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
          margin-bottom: 20px;
        }

        .fp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 3.5rem);
          font-weight: 700;
          color: #e8d5b0;
          line-height: 1.15;
          margin-bottom: 14px;
        }

        .fp-title em {
          font-style: italic;
          color: #7db894;
        }

        .fp-subtitle {
          color: #8a7a65;
          font-size: 1rem;
          font-weight: 300;
          max-width: 480px;
          line-height: 1.6;
        }

        .fp-count {
          margin-top: 20px;
          color: #5c7a5e;
          font-size: 0.85rem;
        }

        .fp-count strong { color: #7db894; }

        /* Search bar */
        .fp-search-bar {
          background: #fefcf8;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
          padding: 20px 2rem;
          position: sticky;
          top: 72px;
          z-index: 40;
        }

        .fp-search-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .fp-search-wrap {
          position: relative;
          max-width: 440px;
        }

        .fp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #8a7a65;
          font-size: 13px;
        }

        .fp-search {
          width: 100%;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 12px;
          padding: 11px 16px 11px 40px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          transition: all 0.2s ease;
        }

        .fp-search::placeholder { color: #a09080; }

        .fp-search:focus {
          border-color: rgba(74, 124, 89, 0.4);
          background: #fefcf8;
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.08);
        }

        /* Main content */
        .fp-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 2rem 80px;
        }

        .fp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .fp-empty {
          text-align: center;
          padding: 80px 20px;
          background: #fefcf8;
          border-radius: 20px;
          border: 1px solid rgba(101, 78, 51, 0.1);
        }

        .fp-empty-icon {
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

        .fp-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #3d2f1e;
          margin-bottom: 8px;
        }

        .fp-empty-sub {
          color: #8a7a65;
          font-size: 0.9rem;
          font-weight: 300;
        }
      `}</style>

      <div className="fp-root">
        {/* Hero */}
        <div className="fp-hero">
          <div className="fp-hero-inner">
            <div className="fp-eyebrow">
              <FaLeaf size={10} /> Local Community
            </div>
            <h1 className="fp-title">
              Meet Our <em>Farmers</em>
            </h1>
            <p className="fp-subtitle">
              Real people, real farms. Connect directly with the growers behind your food.
            </p>
            <p className="fp-count">
              <strong>{filteredFarmers.length}</strong> farmers in our community
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="fp-search-bar">
          <div className="fp-search-inner">
            <div className="fp-search-wrap">
              <FaSearch className="fp-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search farmers by name..."
                className="fp-search"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="fp-main">
          {filteredFarmers.length > 0 ? (
            <div className="fp-grid">
              {filteredFarmers.map((farmer) => (
                <FarmerCard key={farmer._id} farmer={farmer} />
              ))}
            </div>
          ) : (
            <div className="fp-empty">
              <div className="fp-empty-icon"><FaLeaf /></div>
              <h3 className="fp-empty-title">No Farmers Found</h3>
              <p className="fp-empty-sub">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmersPage;