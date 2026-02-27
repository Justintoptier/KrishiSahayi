import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal
 * Wraps children and animates them into view when they enter the viewport.
 *
 * Props:
 *  - animation: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleUp" | "flipUp"
 *  - delay: ms (default 0)
 *  - duration: ms (default 600)
 *  - threshold: 0–1 (default 0.15)
 *  - stagger: if true, children get auto-staggered delays
 *  - className: extra class on wrapper
 *  - once: only animate once (default true)
 */

const ANIMATIONS = {
  fadeUp:    { hidden: "opacity:0; transform:translateY(40px)",    visible: "opacity:1; transform:translateY(0)" },
  fadeDown:  { hidden: "opacity:0; transform:translateY(-30px)",   visible: "opacity:1; transform:translateY(0)" },
  fadeLeft:  { hidden: "opacity:0; transform:translateX(40px)",    visible: "opacity:1; transform:translateX(0)" },
  fadeRight: { hidden: "opacity:0; transform:translateX(-40px)",   visible: "opacity:1; transform:translateX(0)" },
  fadeIn:    { hidden: "opacity:0",                                  visible: "opacity:1" },
  scaleUp:   { hidden: "opacity:0; transform:scale(0.88)",          visible: "opacity:1; transform:scale(1)" },
  flipUp:    { hidden: "opacity:0; transform:perspective(600px) rotateX(20deg) translateY(30px)", visible: "opacity:1; transform:perspective(600px) rotateX(0deg) translateY(0)" },
};

export const ScrollReveal = ({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 650,
  threshold = 0.12,
  className = "",
  once = true,
  as: Tag = "div",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const anim = ANIMATIONS[animation] || ANIMATIONS.fadeUp;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const hiddenStyle = parseStyle(anim.hidden);
  const visibleStyle = parseStyle(anim.visible);

  const style = {
    transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    ...(visible ? visibleStyle : hiddenStyle),
  };

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
};

/**
 * StaggerReveal
 * Wraps a list and staggers each child's reveal animation.
 *
 * Props:
 *  - animation: same as ScrollReveal
 *  - staggerDelay: ms between each child (default 80)
 *  - duration: ms per item
 *  - threshold: viewport threshold
 *  - className: wrapper class
 *  - itemClassName: class on each item wrapper
 */
export const StaggerReveal = ({
  children,
  animation = "fadeUp",
  staggerDelay = 90,
  duration = 600,
  threshold = 0.08,
  className = "",
  itemClassName = "",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const anim = ANIMATIONS[animation] || ANIMATIONS.fadeUp;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenStyle = parseStyle(anim.hidden);
  const visibleStyle = parseStyle(anim.visible);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className={itemClassName}
              style={{
                transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${i * staggerDelay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${i * staggerDelay}ms`,
                ...(visible ? visibleStyle : hiddenStyle),
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
};

// Tiny helper: "opacity:0; transform:translateY(40px)" → {opacity:"0", transform:"translateY(40px)"}
function parseStyle(str) {
  return Object.fromEntries(
    str.split(";").filter(Boolean).map((s) => {
      const [k, ...v] = s.split(":");
      const key = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return [key, v.join(":").trim()];
    })
  );
}

/**
 * useScrollReveal hook
 * Returns [ref, isVisible] for manual use
 */
export const useScrollReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

/**
 * CountUp
 * Animates a number from 0 to `end` when it enters view.
 */
export const CountUp = ({ end, suffix = "", duration = 1800, className = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const isFloat = String(end).includes(".");
    const parsed = parseFloat(end);
    const step = parsed / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= parsed) {
        setCount(parsed);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(start.toFixed(1)) : Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
};

export default ScrollReveal;