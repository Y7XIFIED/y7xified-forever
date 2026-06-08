const PIXEL_MAP: Record<string, number[][]> = {
  Y: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  "7": [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0]],
  X: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
  I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  F: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
  E: [[1,1,1,1],[1,0,0,0],[1,1,1,1],[1,0,0,0],[1,1,1,1]],
  D: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
}

function makeAscii(text: string): string {
  const rows = ["", "", "", "", ""]
  const chars = text.split("")
  chars.forEach((char, ci) => {
    const pm = PIXEL_MAP[char]
    if (!pm) return
    for (let r = 0; r < 5; r++) {
      rows[r] += pm[r].map(p => (p ? "█" : " ")).join("")
      if (ci < chars.length - 1) rows[r] += " "
    }
  })
  return rows.join("\n")
}

const ASCII_Y7XIFIED = makeAscii("Y7XIFIED")

const NavBar = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 select-none"
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
    >
      <pre
        className="text-white font-mono leading-none m-0 p-0"
        style={{ fontSize: "6px", lineHeight: "7px", letterSpacing: "0px", whiteSpace: "pre" }}
        aria-label="Y7XIFIED"
      >
        {ASCII_Y7XIFIED}
      </pre>
      <div className="flex items-center gap-5">
        {[
          { label: "Twitter", href: "https://x.com/y7xified" },
          { label: "Instagram", href: "https://instagram.com/y7xified" },
          { label: "GitHub", href: "https://github.com/y7xified" },
          { label: "About", href: "/about" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-white/40 hover:text-white text-xs font-mono tracking-wider transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
