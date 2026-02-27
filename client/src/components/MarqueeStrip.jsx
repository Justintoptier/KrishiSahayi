/**
 * MarqueeStrip
 * Infinite horizontal marquee ticker. Use between sections on HomePage.
 *
 * Props:
 *  - items: string[] — array of text labels (defaults to farm keywords)
 *  - speed: seconds per full cycle (default 28)
 *  - direction: "left" | "right" (default "left")
 *  - variant: "light" | "dark" (default "light")
 *  - separator: string between items (default "·")
 */

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Jost:wght@400;500&display=swap');

  .mq-root {
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
    position: relative;
  }

  .mq-root.light {
    background: #f0e8d8;
    border-top: 1px solid rgba(101,78,51,0.12);
    border-bottom: 1px solid rgba(101,78,51,0.12);
    padding: 14px 0;
  }

  .mq-root.dark {
    background: linear-gradient(135deg, #2d5a3d, #1e3a27);
    padding: 16px 0;
  }

  .mq-track {
    display: inline-flex;
    align-items: center;
    gap: 0;
    animation: mq-scroll var(--mq-speed) linear infinite;
    will-change: transform;
  }

  .mq-track.reverse {
    animation-direction: reverse;
  }

  @keyframes mq-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .mq-root:hover .mq-track {
    animation-play-state: paused;
  }

  .mq-item {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0 24px;
    transition: opacity 0.2s;
  }

  .light .mq-item {
    color: #5c4a32;
  }

  .dark .mq-item {
    color: rgba(232,213,176,0.7);
  }

  .mq-sep {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1rem;
    opacity: 0.4;
  }

  .light .mq-sep { color: #4a7c59; opacity: 0.5; }
  .dark  .mq-sep { color: #7db894; opacity: 0.4; }

  .mq-icon {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .light .mq-icon { color: #4a7c59; }
  .dark  .mq-icon { color: #7db894; }
`;

const DEFAULT_ITEMS = [
  "🌱 Farm Fresh",
  "🍅 Seasonal Produce",
  "🤝 Direct from Farmers",
  "🌿 Organic & Natural",
  "🥦 No Middlemen",
  "🌾 Sustainably Grown",
  "🍯 Local Honey & More",
  "🥕 Harvest Daily",
  "♻️ Zero Waste Farming",
  "🌻 Community Supported",
];

let styleInjected = false;
const inject = () => {
  if (styleInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = STYLE;
  document.head.appendChild(el);
  styleInjected = true;
};

export const MarqueeStrip = ({
  items = DEFAULT_ITEMS,
  speed = 30,
  direction = "left",
  variant = "light",
  separator = "✦",
}) => {
  inject();

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className={`mq-root ${variant}`}
      style={{ "--mq-speed": `${speed}s` }}
    >
      <div className={`mq-track ${direction === "right" ? "reverse" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="mq-item">
            {item}
            <span className="mq-sep">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;