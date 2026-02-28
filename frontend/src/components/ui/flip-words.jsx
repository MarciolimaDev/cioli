"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FlipWords({ words = [], className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words.length) return undefined;

    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % words.length);
    }, 2400);

    return () => {
      clearInterval(timer);
    };
  }, [words]);

  return (
    <span
      className="relative inline-flex min-h-[2.5em] items-center"
    >
      <span className="pointer-events-none absolute -inset-2 rounded-2xl blur-md" />

      <span className="relative inline-flex items-center rounded-2xl px-4 py-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, scale: 1.08, filter: "blur(12px)" }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className={`inline-block whitespace-nowrap font-semibold tracking-normal text-sky-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)] ${className}`.trim()}
          >
            {words[index] ?? ""}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
