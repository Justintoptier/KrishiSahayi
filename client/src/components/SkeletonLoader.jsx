/**
 * SkeletonLoader
 * Shimmer skeleton placeholders matching the earthy design system.
 *
 * Exports:
 *  - ProductCardSkeleton
 *  - FarmerCardSkeleton
 *  - OrderItemSkeleton
 *  - TextLineSkeleton
 *  - SkeletonGrid  (wraps N skeletons in a responsive grid)
 */

const SHIMMER_STYLE = `
  @keyframes sk-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  .sk-base {
    background: linear-gradient(
      90deg,
      #f0e8d8 0px,
      #faf6f0 40%,
      #f0e8d8 80%
    );
    background-size: 600px 100%;
    animation: sk-shimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
  }

  .sk-card {
    background: #fefcf8;
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px;
    overflow: hidden;
  }

  .sk-img { height: 200px; border-radius: 0; }

  .sk-body { padding: 18px 20px 20px; }

  .sk-line { height: 12px; margin-bottom: 10px; }
  .sk-line-lg { height: 18px; margin-bottom: 12px; }
  .sk-line-sm { height: 10px; margin-bottom: 8px; }

  .sk-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    border-top: 1px solid rgba(101,78,51,0.08);
    margin-top: 8px;
  }

  .sk-price { width: 80px; height: 22px; }
  .sk-btn  { width: 64px; height: 32px; border-radius: 100px; }

  /* Farmer card */
  .sk-farmer-card {
    background: #fefcf8;
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sk-farmer-top { display: flex; align-items: center; gap: 16px; }
  .sk-avatar { width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0; }
  .sk-farmer-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }

  /* Order item */
  .sk-order {
    background: #fefcf8;
    border: 1px solid rgba(101,78,51,0.1);
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .sk-order-img { width: 56px; height: 56px; border-radius: 12px; flex-shrink: 0; }
  .sk-order-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .sk-order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
`;

// Inject styles once
let injected = false;
const injectStyles = () => {
  if (injected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = SHIMMER_STYLE;
  document.head.appendChild(el);
  injected = true;
};

// Shimmer block primitive
const Shimmer = ({ className = "", style = {} }) => {
  injectStyles();
  return <div className={`sk-base ${className}`} style={style} />;
};

// ── Product Card Skeleton ──────────────────────────────────
export const ProductCardSkeleton = () => {
  injectStyles();
  return (
    <div className="sk-card">
      <Shimmer className="sk-img" />
      <div className="sk-body">
        <Shimmer className="sk-line-lg" style={{ width: "70%" }} />
        <Shimmer className="sk-line-sm" style={{ width: "45%" }} />
        <div className="sk-footer">
          <Shimmer className="sk-price" />
          <Shimmer className="sk-btn" />
        </div>
      </div>
    </div>
  );
};

// ── Farmer Card Skeleton ──────────────────────────────────
export const FarmerCardSkeleton = () => {
  injectStyles();
  return (
    <div className="sk-farmer-card">
      <div className="sk-farmer-top">
        <Shimmer className="sk-avatar" />
        <div className="sk-farmer-info">
          <Shimmer className="sk-line-lg" style={{ width: "60%" }} />
          <Shimmer className="sk-line-sm" style={{ width: "40%" }} />
        </div>
      </div>
      <Shimmer style={{ height: 38, borderRadius: 10 }} />
    </div>
  );
};

// ── Order Item Skeleton ──────────────────────────────────
export const OrderItemSkeleton = () => {
  injectStyles();
  return (
    <div className="sk-order">
      <Shimmer className="sk-order-img" />
      <div className="sk-order-info">
        <Shimmer className="sk-line" style={{ width: "50%" }} />
        <Shimmer className="sk-line-sm" style={{ width: "35%" }} />
      </div>
      <div className="sk-order-right">
        <Shimmer style={{ width: 70, height: 24, borderRadius: 100 }} />
        <Shimmer style={{ width: 80, height: 18 }} />
      </div>
    </div>
  );
};

// ── Text Lines Skeleton ──────────────────────────────────
export const TextLineSkeleton = ({ lines = 3 }) => {
  injectStyles();
  const widths = [100, 85, 65, 90, 75, 55];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} className="sk-line" style={{ width: `${widths[i % widths.length]}%` }} />
      ))}
    </div>
  );
};

// ── SkeletonGrid ──────────────────────────────────────────
export const SkeletonGrid = ({
  count = 4,
  type = "product",
  columns = "repeat(auto-fill, minmax(240px, 1fr))",
  gap = 20,
}) => {
  injectStyles();
  const CardComp = type === "farmer" ? FarmerCardSkeleton
    : type === "order" ? OrderItemSkeleton
    : ProductCardSkeleton;

  const isStack = type === "order";

  return (
    <div
      style={{
        display: isStack ? "flex" : "grid",
        flexDirection: isStack ? "column" : undefined,
        gridTemplateColumns: isStack ? undefined : columns,
        gap,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardComp key={i} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;