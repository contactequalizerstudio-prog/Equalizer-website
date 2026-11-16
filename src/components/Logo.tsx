import { useId } from "react";

/** Equalizer Studio wordmark: spectrum wave, "equalizer", handwritten "Studio". */
export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const id = useId();
  const big = size === "lg";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 38 26"
        width={big ? 46 : 38}
        height={big ? 32 : 26}
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={id} x1="0" x2="1">
            <stop offset="0" stopColor="#6bdde3" />
            <stop offset=".55" stopColor="#b28cfc" />
            <stop offset="1" stopColor="#f996da" />
          </linearGradient>
        </defs>
        <path
          d="M2 15c4 0 4-10 8-10s4 16 8 16 4-14 8-14 4 8 10 8"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-display font-bold tracking-[-0.03em] text-foreground ${
          big ? "text-2xl" : "text-[1.35rem]"
        }`}
      >
        equalizer
      </span>
      <span
        className={`font-script text-pink -ml-1.5 inline-block -rotate-[4deg] ${
          big ? "text-2xl" : "text-[1.35rem]"
        }`}
      >
        Studio
      </span>
    </span>
  );
}
