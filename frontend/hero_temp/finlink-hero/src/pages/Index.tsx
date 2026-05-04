import { useEffect, useRef, useState } from "react";
import heroDashboard from "@/assets/hero-dashboard.png";
import heroClouds from "@/assets/hero-clouds.png";
import heroSkyline from "@/assets/hero-skyline.png";

const Index = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!sceneRef.current) return;
        const rect = sceneRef.current.getBoundingClientRect();
        setScrollY(-rect.top);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const py = (factor: number) => `translate3d(0, ${scrollY * factor}px, 0)`;
  const pyx = (yFactor: number, xOffset = 0) =>
    `translate3d(${xOffset}px, ${scrollY * yFactor}px, 0)`;

  return (
    <main className="min-h-screen bg-sky-gradient overflow-hidden">
      {/* Top nav */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="#" className="font-display text-xl font-medium tracking-tight text-foreground">
          Finlink<span className="text-muted-foreground">.</span>
        </a>
        <nav className="hidden items-center gap-10 text-sm text-muted-foreground md:flex">
          <a href="#" className="transition-colors hover:text-foreground">Product</a>
          <a href="#" className="transition-colors hover:text-foreground">Markets</a>
          <a href="#" className="transition-colors hover:text-foreground">About</a>
        </nav>
        <a
          href="#"
          className="rounded-full bg-brand-green px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_20px_-8px_hsl(var(--brand-green)/0.6)] transition-all hover:bg-brand-green-deep"
        >
          Get the app
        </a>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Headline block */}
        <div className="relative z-20 mx-auto max-w-6xl px-6 pt-10 text-center md:pt-16">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            — Own your future —
          </p>
          <h1 className="font-display text-5xl font-light leading-[0.95] text-foreground sm:text-6xl md:text-7xl lg:text-[8rem]">
            Your <span className="text-brand-green-deep italic">Investments</span>,
            <br />
            <span className="relative inline-block italic">
              One Link Away.
              <svg
                aria-hidden="true"
                viewBox="0 0 600 24"
                className="absolute -bottom-3 left-0 w-full text-brand-green"
                preserveAspectRatio="none"
              >
                <path
                  d="M5 14 C 120 4, 280 22, 420 8 S 580 16, 595 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-10 max-w-md text-base text-muted-foreground">
            One quiet app to hold every position, every market, every move — all in a tap.
          </p>
        </div>

        {/* Scene */}
        <div
          ref={sceneRef}
          className="relative mx-auto mt-16 h-[520px] w-full max-w-7xl px-4 sm:h-[620px] md:h-[720px] md:mt-20"
        >
          {/* Dashed center guide */}
          <div
            aria-hidden="true"
            className="dashed-guide pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-50"
          />

          {/* === PARALLAX BACKDROP === */}

          {/* Cloud layer 1 — far back, very faint, slowest, spread wide */}
          <img
            src={heroClouds}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1024}
            className="animate-drift-slow pointer-events-none absolute -top-32 left-0 z-0 h-[45%] w-[200%] -translate-x-[25%] select-none object-cover object-top opacity-35 blur-[2px] will-change-transform"
            style={{ transform: py(-0.05) }}
          />

          {/* Skyline layer 1 — farthest, smallest, faded */}
          <img
            src={heroSkyline}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="pointer-events-none absolute inset-x-0 bottom-16 z-0 mx-auto w-[90%] max-w-none select-none object-contain object-bottom opacity-35 blur-[1.5px] will-change-transform"
            style={{ transform: py(-0.08) }}
          />

          {/* Cloud layer 2 — mid back, spread wide */}
          <img
            src={heroClouds}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1024}
            className="animate-drift-reverse pointer-events-none absolute -top-20 left-0 z-0 h-[40%] w-[180%] -translate-x-[20%] select-none object-cover object-top opacity-65 will-change-transform"
            style={{ transform: pyx(-0.12) }}
          />

          {/* Skyline layer 2 — mid */}
          <img
            src={heroSkyline}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="pointer-events-none absolute inset-x-0 bottom-4 z-0 mx-auto w-[105%] max-w-none -translate-x-[2%] select-none object-contain object-bottom opacity-70 will-change-transform"
            style={{ transform: py(-0.18) }}
          />

          {/* Skyline layer 3 — front, sharp, full */}
          <img
            src={heroSkyline}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] mx-auto w-[125%] max-w-none -translate-x-[10%] select-none object-contain object-bottom opacity-100 will-change-transform"
            style={{ transform: py(-0.28) }}
          />

          {/* Cloud layer 3 — foreground, fastest, spread widest */}
          <img
            src={heroClouds}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1024}
            className="animate-drift pointer-events-none absolute -top-40 left-0 z-[2] h-[50%] w-[220%] -translate-x-[30%] select-none object-cover object-top opacity-85 will-change-transform"
            style={{ transform: py(-0.35) }}
          />

          {/* Tiny floating tickers — left */}
          <div className="absolute left-4 top-24 z-10 hidden rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-xs shadow-soft backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <span className="font-display text-base">AAPL</span>
              <span className="rounded-full bg-brand-green-soft px-2 py-0.5 font-medium text-brand-green-deep">+1.82%</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Live · NASDAQ
            </div>
          </div>

          {/* Tiny floating tickers — right */}
          <div className="absolute right-4 top-40 z-10 hidden rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-xs shadow-soft backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <span className="font-display text-base">€ EUR</span>
              <span className="font-medium text-foreground">1.0842</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              FX · Spot
            </div>
          </div>

          {/* Dashboard laptop (foreground, centered) */}
          <div className="animate-float relative z-10 mx-auto flex h-full items-end justify-center pb-2">
            <img
              src={heroDashboard}
              alt="Finlink dashboard on a laptop showing portfolio balance, performance chart, stat cards and a watchlist"
              width={1600}
              height={1216}
              className="h-auto w-[92%] max-w-4xl drop-shadow-[0_40px_60px_hsl(222_40%_11%/0.18)] sm:w-[88%] md:w-[82%]"
              fetchPriority="high"
            />
          </div>

          {/* Bottom fade into page */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
          />
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 mx-auto -mt-6 flex max-w-7xl items-center justify-between px-6 pb-12 text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:px-10">
          <span>est. 2026</span>
          <span className="hidden md:inline">scroll ↓</span>
          <span>iOS · Android</span>
        </div>
      </section>
    </main>
  );
};

export default Index;
