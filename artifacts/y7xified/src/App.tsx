import { useEffect, useRef } from "react";
import AnimatedHeroSection from "@/components/ui/animated-hero-section";
import AnimatedFooter from "@/components/ui/animated-footer";

const monoStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#fff",
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const sections = 2;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollToSection = (index: number) => {
      if (isAnimatingRef.current) return;
      const clamped = Math.max(0, Math.min(sections - 1, index));
      if (clamped === currentSectionRef.current) return;

      isAnimatingRef.current = true;
      const startY = container.scrollTop;
      const targetY = clamped * container.clientHeight;
      const distance = targetY - startY;
      const duration = 900;
      let startTime: number | null = null;

      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = startY + distance * easeInOutCubic(progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          currentSectionRef.current = clamped;
          isAnimatingRef.current = false;
        }
      };

      requestAnimationFrame(step);
    };

    let wheelAccum = 0;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { wheelAccum = 0; }, 200);

      if (Math.abs(wheelAccum) > 80) {
        const dir = wheelAccum > 0 ? 1 : -1;
        scrollToSection(currentSectionRef.current + dir);
        wheelAccum = 0;
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 40) scrollToSection(currentSectionRef.current + (delta > 0 ? 1 : -1));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <div style={{ height: "100vh", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem 2rem",
            pointerEvents: "none",
          }}
        >
          <span style={monoStyle}>Y7XIFIED</span>
          <span style={{ ...monoStyle, opacity: 0.4 }}>EST. 07</span>
        </div>
        <AnimatedHeroSection />
      </div>

      <div style={{ height: "50vh" }}>
        <AnimatedFooter barCount={23} />
      </div>
    </div>
  );
}

export default App;
