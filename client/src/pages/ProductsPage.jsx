"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { FaFilter, FaSearch, FaLeaf, FaTimes } from "react-icons/fa";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { products, loading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({ category: "", search: "", sort: "newest" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) setFilters((prev) => ({ ...prev, category: categoryParam }));
  }, [dispatch, location.search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      dispatch(getProducts(params));
    }, 600);
    return () => clearTimeout(delay);
  }, [dispatch, filters.category, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (filters.sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (filters.sort === "price-low") return a.price - b.price;
    if (filters.sort === "price-high") return b.price - a.price;
    return 0;
  });

  const activeCategory = categories.find((c) => c._id === filters.category);

  if (loading || categoryLoading) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .pp-root {
          font-family: 'Jost', sans-serif;
          min-height: 100vh;
          background: #f9f5ef;
        }

        .pp-hero {
          background: linear-gradient(135deg, #1e2a1f 0%, #2d3a2e 60%, #1a2e20 100%);
          padding: 72px 2rem 64px;
          position: relative;
          overflow: hidden;
        }

        .pp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse at 70% 50%, rgba(74, 124, 89, 0.25) 0%, transparent 60%),
                            radial-gradient(ellipse at 20% 80%, rgba(139, 105, 20, 0.12) 0%, transparent 50%);
        }

        .pp-hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
        }

        .pp-eyebrow {
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

        .pp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 3.5rem);
          font-weight: 700;
          color: #e8d5b0;
          line-height: 1.15;
          margin-bottom: 14px;
        }

        .pp-title em {
          font-style: italic;
          color: #7db894;
        }

        .pp-subtitle {
          color: #8a7a65;
          font-size: 1rem;
          font-weight: 300;
          max-width: 480px;
          line-height: 1.6;
        }

        .pp-count {
          margin-top: 20px;
          color: #5c7a5e;
          font-size: 0.85rem;
          font-weight: 400;
        }

        .pp-count strong { color: #7db894; }

        /* Toolbar */
        .pp-toolbar {
          background: #fefcf8;
          border-bottom: 1px solid rgba(101, 78, 51, 0.1);
          padding: 20px 2rem;
          position: sticky;
          top: 72px;
          z-index: 40;
        }

        .pp-toolbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .pp-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .pp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #8a7a65;
          font-size: 13px;
        }

        .pp-search {
          width: 100%;
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 12px;
          padding: 11px 16px 11px 38px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #3d2f1e;
          outline: none;
          transition: all 0.2s ease;
        }

        .pp-search::placeholder { color: #a09080; }

        .pp-search:focus {
          border-color: rgba(74, 124, 89, 0.4);
          background: #fefcf8;
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.08);
        }

        .pp-select {
          background: #f4ede0;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 12px;
          padding: 11px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          color: #3d2f1e;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pp-select:focus {
          border-color: rgba(74, 124, 89, 0.4);
        }

        .pp-filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${showFilters ? 'linear-gradient(135deg, #4a7c59, #2d5a3d)' : '#f4ede0'};
          color: ${showFilters ? '#e8d5b0' : '#3d2f1e'};
          border: 1px solid ${showFilters ? 'transparent' : 'rgba(101, 78, 51, 0.15)'};
          border-radius: 12px;
          padding: 11px 18px;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .pp-filter-btn:hover {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border-color: transparent;
        }

        /* Filter panel */
        .pp-filter-panel {
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 0 4px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .pp-filter-label {
          font-size: 0.8rem;
          color: #8a7a65;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-right: 4px;
        }

        .pp-cat-chip {
          background: #f0e8d8;
          border: 1px solid rgba(101, 78, 51, 0.15);
          border-radius: 100px;
          padding: 7px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #5c4a32;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pp-cat-chip:hover,
        .pp-cat-chip.active {
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          color: #e8d5b0;
          border-color: transparent;
        }

        /* Active filter tag */
        .pp-active-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 124, 89, 0.12);
          border: 1px solid rgba(74, 124, 89, 0.25);
          border-radius: 100px;
          padding: 5px 12px 5px 14px;
          font-size: 0.8rem;
          color: #2d5a3d;
          font-weight: 500;
        }

        .pp-tag-remove {
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
          background: none;
          border: none;
          color: #2d5a3d;
          padding: 0;
          display: flex;
        }

        .pp-tag-remove:hover { opacity: 1; }

        /* Main content */
        .pp-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 2rem 80px;
        }

        .pp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .pp-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
        }

        .pp-empty-icon {
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

        .pp-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #3d2f1e;
          margin-bottom: 8px;
        }

        .pp-empty-sub {
          color: #8a7a65;
          font-size: 0.9rem;
          font-weight: 300;
        }
      `}</style>

      <div className="pp-root">
        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-hero-inner">
            <div className="pp-eyebrow">
              <FaLeaf size={10} /> Farm Fresh
            </div>
            <h1 className="pp-title">
              Browse <em>Fresh</em><br />Produce
            </h1>
            <p className="pp-subtitle">
              Sourced directly from local farmers. Seasonal, sustainable, and straight to your door.
            </p>
            <p className="pp-count">
              <strong>{sortedProducts.length}</strong> products available
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="pp-toolbar">
          <div className="pp-toolbar-inner">
            <div className="pp-search-wrap">
              <FaSearch className="pp-search-icon" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search for tomatoes, honey, rice..."
                className="pp-search"
              />
            </div>

            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="pp-select">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>

            <button className="pp-filter-btn" onClick={() => setShowFilters(!showFilters)}>
              <FaFilter size={12} />
              Categories
            </button>
          </div>

          {showFilters && (
            <div className="pp-filter-panel">
              <span className="pp-filter-label">Filter by:</span>
              <button
                className={`pp-cat-chip ${!filters.category ? "active" : ""}`}
                onClick={() => setFilters((p) => ({ ...p, category: "" }))}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`pp-cat-chip ${filters.category === cat._id ? "active" : ""}`}
                  onClick={() => setFilters((p) => ({ ...p, category: cat._id }))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filters */}
        {(filters.search || activeCategory) && (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 2rem 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {activeCategory && (
              <span className="pp-active-tag">
                {activeCategory.name}
                <button className="pp-tag-remove" onClick={() => setFilters((p) => ({ ...p, category: "" }))}>
                  <FaTimes size={10} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="pp-active-tag">
                "{filters.search}"
                <button className="pp-tag-remove" onClick={() => setFilters((p) => ({ ...p, search: "" }))}>
                  <FaTimes size={10} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="pp-main">
          <div className="pp-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="pp-empty">
                <div className="pp-empty-icon"><FaLeaf /></div>
                <h3 className="pp-empty-title">No Products Found</h3>
                <p className="pp-empty-sub">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;