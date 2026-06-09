import AnimatedHeroSection from "@/components/ui/animated-hero-section";
import AnimatedFooter from "@/components/ui/animated-footer";

const monoStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#fff",
}

function App() {
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >

      <div style={{ scrollSnapAlign: "start", height: "100vh", position: "relative" }}>
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

      <div style={{ scrollSnapAlign: "start" }}>
        <AnimatedFooter barCount={23} />
      </div>
    </div>
  );
}

export default App;
