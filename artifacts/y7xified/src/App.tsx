import AnimatedHeroSection from "@/components/ui/animated-hero-section";
import AnimatedFooter from "@/components/ui/animated-footer";
import NavBar from "@/components/ui/nav-bar";

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
      <NavBar />

      <div style={{ scrollSnapAlign: "start", height: "100vh" }}>
        <AnimatedHeroSection />
      </div>

      <div style={{ scrollSnapAlign: "start" }}>
        <AnimatedFooter barCount={23} />
      </div>
    </div>
  );
}

export default App;
