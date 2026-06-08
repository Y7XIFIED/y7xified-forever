import { useState, useCallback } from "react";
import AnimatedHeroSection from "@/components/ui/animated-hero-section";
import AnimatedFooter from "@/components/ui/animated-footer";
import NavBar from "@/components/ui/nav-bar";
import LoadingScreen from "@/components/ui/loading-screen";

function App() {
  const [_loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      <LoadingScreen onDone={handleDone} />
      <NavBar />

      <div style={{ scrollSnapAlign: "start", height: "100vh" }}>
        <AnimatedHeroSection />
      </div>

      <div style={{ scrollSnapAlign: "start" }}>
        <AnimatedFooter
          leftLinks={[
            { href: "/terms", label: "Terms & policies" },
            { href: "/privacy-policy", label: "Privacy policy" },
          ]}
          rightLinks={[
            { href: "/about", label: "About Y7XIFIED" },
            { href: "https://x.com/y7xified", label: "Twitter" },
            { href: "https://www.instagram.com/y7xified", label: "Instagram" },
            { href: "https://github.com/y7xified", label: "GitHub" },
          ]}
          copyrightText="Y7XIFIED 2025."
          barCount={23}
        />
      </div>
    </div>
  );
}

export default App;
