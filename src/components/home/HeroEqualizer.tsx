"use client";

import { useEffect, useRef } from "react";

/** Decorative spectrum equalizer. Reacts to the pointer; static when motion is reduced. */
export default function HeroEqualizer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const zone = cv?.parentElement;
    const ctx = cv?.getContext("2d");
    if (!cv || !zone || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seg = 6;
    const gap = 4;
    let W = 0, H = 0, bars = 0, step = 16, bw = 10, mx = -1, t = 0, raf = 0;
    let peaks: number[] = [];
    let running = false;

    const mix = (a: number, b: number, k: number) => Math.round(a + (b - a) * k);
    const colour = (k: number) => {
      const A = [107, 221, 227], B = [178, 140, 252], C = [249, 150, 218];
      const [p, q, u] = k < 0.55 ? [A, B, k / 0.55] as const : [B, C, (k - 0.55) / 0.45] as const;
      return `rgb(${mix(p[0], q[0], u)},${mix(p[1], q[1], u)},${mix(p[2], q[2], u)})`;
    };
    const level = (i: number) => {
      const x = i / bars;
      let v = 0.34 + 0.2 * Math.sin(x * 9 + t * 1.3) + 0.16 * Math.sin(x * 23 - t * 2.1) + 0.1 * Math.sin(x * 47 + t * 3.7);
      v *= 0.55 + 0.45 * Math.sin(Math.PI * x); // quieter at the edges
      if (mx >= 0) {
        const d = (i * step - mx) / 150;
        v += 0.5 * Math.exp(-d * d);
      }
      return Math.max(0.04, Math.min(1, v));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const rows = Math.floor(H / (seg + gap));
      for (let i = 0; i < bars; i++) {
        const n = Math.max(1, Math.round(level(i) * rows));
        const x = i * step;
        ctx.fillStyle = colour(i / bars);
        for (let r = 0; r < n; r++) {
          ctx.globalAlpha = 0.35 + 0.65 * (r / rows);
          ctx.fillRect(x, H - (r + 1) * (seg + gap) + gap, bw, seg);
        }
        peaks[i] = Math.max(n, peaks[i] - 0.12);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#edf7f7";
        ctx.fillRect(x, H - (Math.ceil(peaks[i]) + 1) * (seg + gap) + gap + 2, bw, 2);
      }
      ctx.globalAlpha = 1;
    };
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = W < 600 ? 12 : 16;
      bw = step - 6;
      bars = Math.ceil(W / step);
      peaks = new Array(bars).fill(0);
      draw();
    };
    const loop = () => {
      if (!running) return;
      t += 0.016;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX - cv.getBoundingClientRect().left;
      if (reduce) draw();
    };
    const onLeave = () => {
      mx = -1;
      if (reduce) draw();
    };

    window.addEventListener("resize", size);
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", onLeave);
    size();

    let io: IntersectionObserver | undefined;
    if (!reduce) {
      io = new IntersectionObserver((entries) => {
        const on = entries[0].isIntersecting;
        if (on && !running) {
          running = true;
          loop();
        } else if (!on) {
          running = false;
        }
      });
      io.observe(cv);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", size);
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="eq" aria-hidden="true">
      <span className="hint">Passez la souris, le son monte</span>
      <canvas ref={ref} />
    </div>
  );
}
