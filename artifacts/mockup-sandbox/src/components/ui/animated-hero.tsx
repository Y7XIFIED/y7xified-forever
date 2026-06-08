import React, { useEffect, useRef } from "react";

const AnimatedHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsl(${210 + Math.sin(t * 0.3) * 20}, 80%, 8%)`);
      gradient.addColorStop(1, `hsl(${240 + Math.cos(t * 0.2) * 20}, 70%, 5%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 3; i++) {
        const cx = width * (0.3 + i * 0.2 + Math.sin(t * 0.15 + i) * 0.1);
        const cy = height * (0.4 + Math.cos(t * 0.1 + i * 1.2) * 0.2);
        const r = width * (0.25 + Math.sin(t * 0.08 + i) * 0.05);
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const hue = 200 + i * 30 + Math.sin(t * 0.05) * 20;
        g2.addColorStop(0, `hsla(${hue}, 90%, 60%, 0.15)`);
        g2.addColorStop(1, `hsla(${hue}, 90%, 60%, 0)`);
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white" />
          <span className="text-white font-semibold text-sm tracking-wide">Cluely</span>
        </div>
        <ul className="hidden md:flex items-center gap-8">
          {["Product", "Pricing", "Blog", "Careers"].map((item) => (
            <li key={item}>
              <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">
            Sign in
          </a>
          <a
            href="#"
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
          >
            Get started
          </a>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-white/60 text-xs tracking-wide">Now in beta — join 50,000+ users</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          Work smarter,
          <br />
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            not harder.
          </span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
          The AI-powered assistant that lives in your workflow — answering questions, writing content, and handling tasks so you can focus on what matters.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#"
            className="bg-white text-black font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 transition-all text-sm w-full sm:w-auto text-center"
          >
            Start for free
          </a>
          <a
            href="#"
            className="border border-white/15 text-white/80 font-medium px-7 py-3.5 rounded-full hover:border-white/30 hover:text-white transition-all text-sm backdrop-blur-sm w-full sm:w-auto text-center"
          >
            Watch demo →
          </a>
        </div>

        <p className="mt-6 text-white/30 text-xs">No credit card required · Free forever plan</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default AnimatedHero;
