import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * PageTransition
 * Wraps route content with a smooth fade+lift transition on route change.
 * Drop it in App.jsx around <Routes> or inside Layout.jsx around <Outlet />.
 *
 * Props:
 *  - children
 *  - duration: ms (default 320)
 */

const STYLE = `
  .pt-enter {
    opacity: 0;
    transform: translateY(14px);
  }
  .pt-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity var(--pt-dur) cubic-bezier(0.22,1,0.36,1),
                transform var(--pt-dur) cubic-bezier(0.22,1,0.36,1);
  }
  .pt-exit {
    opacity: 1;
    transform: translateY(0);
  }
  .pt-exit-active {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity calc(var(--pt-dur) * 0.6) ease,
                transform calc(var(--pt-dur) * 0.6) ease;
  }

  /* Progress bar */
  .pt-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2.5px;
    background: linear-gradient(90deg, #4a7c59, #7db894, #4a7c59);
    background-size: 200%;
    z-index: 9999;
    pointer-events: none;
    border-radius: 0 2px 2px 0;
    animation: pt-bar-shimmer 1.2s linear infinite;
    transition: width 0.25s ease, opacity 0.3s ease;
  }

  @keyframes pt-bar-shimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
`;

let styleInjected = false;
const injectStyle = () => {
  if (styleInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = STYLE;
  document.head.appendChild(el);
  styleInjected = true;
};

export const PageTransition = ({ children, duration = 320 }) => {
  injectStyle();
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [phase, setPhase] = useState("enter-active"); // "exit" | "enter" | "enter-active"
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    // Start progress bar
    setShowProgress(true);
    setProgress(30);
    const p1 = setTimeout(() => setProgress(65), 80);
    const p2 = setTimeout(() => setProgress(85), 180);

    // Exit phase
    setPhase("exit-active");

    timerRef.current = setTimeout(() => {
      setDisplayLocation(location);
      setPhase("enter");
      // Allow one frame then go to enter-active
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("enter-active");
          setProgress(100);
          setTimeout(() => {
            setShowProgress(false);
            setProgress(0);
          }, 400);
        });
      });
    }, duration * 0.55);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(p1);
      clearTimeout(p2);
    };
  }, [location.pathname]);

  const cls =
    phase === "exit-active"  ? "pt-exit pt-exit-active"
    : phase === "enter"      ? "pt-enter"
    : "pt-enter-active";

  return (
    <>
      {showProgress && (
        <div
          className="pt-progress"
          style={{
            width: `${progress}%`,
            opacity: progress === 100 ? 0 : 1,
          }}
        />
      )}
      <div
        className={cls}
        style={{ "--pt-dur": `${duration}ms` }}
        key={displayLocation.pathname}
      >
        {children}
      </div>
    </>
  );
};

export default PageTransition;