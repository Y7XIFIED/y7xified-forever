import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onDone: () => void
}

const LoadingScreen = ({ onDone }: LoadingScreenProps) => {
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "gone">("in")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100)
    const t2 = setTimeout(() => setPhase("out"), 1600)
    const t3 = setTimeout(() => {
      setPhase("gone")
      onDone()
    }, 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  if (phase === "gone") return null

  const opacity = phase === "in" ? 0 : phase === "hold" ? 1 : 0
  const letterSpacing = phase === "hold" ? "0.35em" : "0.1em"

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-6"
      style={{ opacity, transition: phase === "in" ? "opacity 0.4s ease" : "opacity 0.5s ease", letterSpacing }}
    >
      <span
        className="text-white font-mono font-bold text-3xl"
        style={{ letterSpacing, transition: "letter-spacing 1.4s ease" }}
      >
        Y7XIFIED
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1 h-1 bg-white rounded-full"
            style={{
              animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
