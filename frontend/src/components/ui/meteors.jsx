"use client";

import { useMemo } from "react";

export default function Meteors({ number = 10 }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 6,
      })),
    [number]
  );

  return (
    <>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="pointer-events-none absolute top-0 h-1 w-1 rotate-[215deg] animate-meteor rounded-full bg-cyan-300 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        >
          <span className="absolute -top-0.5 left-0 h-[1px] w-[70px] -translate-x-full bg-gradient-to-r from-cyan-300 to-transparent" />
        </span>
      ))}
    </>
  );
}
