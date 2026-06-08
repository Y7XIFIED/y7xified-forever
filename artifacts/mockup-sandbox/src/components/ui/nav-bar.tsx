const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 select-none"
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
      <span className="text-white font-mono font-bold tracking-[0.25em] text-sm">Y7XIFIED</span>
      <div className="flex items-center gap-5">
        {[
          { label: "Twitter", href: "https://x.com/y7xified" },
          { label: "Instagram", href: "https://instagram.com/y7xified" },
          { label: "GitHub", href: "https://github.com/y7xified" },
          { label: "About", href: "/about" },
        ].map(({ label, href }) => (
          <a key={label} href={href}
            className="text-white/40 hover:text-white text-xs font-mono tracking-wider transition-colors duration-200">
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
