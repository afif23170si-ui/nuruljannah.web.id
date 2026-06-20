"use client";

import { useEffect, useRef } from "react";

/**
 * OrgChartScaler — Client Component
 *
 * Scales a 1024px-wide org chart to fit any screen width using
 * CSS transform: scale(), which works universally across all browsers
 * including iOS Safari and Chrome on iPhone.
 *
 * Why not CSS zoom?
 * → CSS `zoom` is inconsistently handled on WebKit-based iOS browsers.
 *   Chrome DevTools simulates it fine, but real iPhones do not respect it,
 *   causing text to render at full (unscaled) size.
 */
export function OrgChartScaler({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;

      // Temporarily remove transform so we can measure the true natural height
      inner.style.transform = "none";

      const naturalHeight = inner.scrollHeight;
      const containerWidth = container.offsetWidth;
      const scale = Math.min(1, containerWidth / 1024);

      // Apply scale from top center so centering is preserved at all sizes
      inner.style.transform = `scale(${scale})`;
      inner.style.transformOrigin = "top center";

      // Set container height to match visual (scaled) height
      container.style.height = `${Math.ceil(naturalHeight * scale)}px`;
    };

    // Double rAF ensures layout is fully painted before measuring
    requestAnimationFrame(() => requestAnimationFrame(update));

    const resizeObserver = new ResizeObserver(update);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    // flex + justify-center centers the 1024px inner div on wide screens
    <div
      ref={containerRef}
      className="w-full overflow-hidden flex justify-center"
      style={{ height: 0 }}
    >
      <div
        ref={innerRef}
        // shrink-0 prevents flex from compressing the fixed 1024px width
        className="w-[1024px] shrink-0 flex flex-col items-center pt-4 pb-8"
        style={{
          transformOrigin: "top center",
          // Disable iOS automatic text size inflation
          WebkitTextSizeAdjust: "none",
          textSizeAdjust: "none",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
