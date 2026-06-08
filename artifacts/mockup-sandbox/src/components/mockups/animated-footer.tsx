import { useState, useCallback } from "react"
import { PromptingIsAllYouNeed } from "@/components/ui/animated-hero-section"
import Footer from "@/components/ui/animated-footer"
import NavBar from "@/components/ui/nav-bar"
import LoadingScreen from "@/components/ui/loading-screen"

const DemoOne = () => {
  const [_loaded, setLoaded] = useState(false)
  const handleDone = useCallback(() => setLoaded(true), [])

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

      <div style={{ scrollSnapAlign: "start", height: "100vh", flexShrink: 0 }}>
        <PromptingIsAllYouNeed />
      </div>

      <div style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
        <Footer
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
  )
}

export { DemoOne }
export default DemoOne
