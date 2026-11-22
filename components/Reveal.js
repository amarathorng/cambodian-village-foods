// components/Reveal.js
// Fades a section up the first time it enters the viewport. The CSS lives in
// archive.css (.reveal / .is-visible) and is disabled under
// prefers-reduced-motion. If IntersectionObserver is unavailable — or scripts
// never run, see the <noscript> rule in app/layout.js — content stays visible.
"use client";

import { useEffect, useRef } from "react";

export default function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          element.classList.add("is-visible");
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
