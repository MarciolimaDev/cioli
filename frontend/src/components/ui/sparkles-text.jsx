"use client";

import { motion } from "framer-motion";

const sparkles = [
  { id: 1, top: "-18%", left: "8%", size: "text-sm", delay: 0 },
  { id: 2, top: "8%", right: "-10%", size: "text-base", delay: 0.45 },
  { id: 3, bottom: "-15%", left: "26%", size: "text-xs", delay: 0.9 },
  { id: 4, top: "-20%", right: "25%", size: "text-xs", delay: 1.25 },
];

export default function SparklesText({ text }) {
  return (
    <span className="relative inline-flex items-center pr-2">
      <span className="bg-gradient-to-r from-[#0890F8] via-[#1897F2] to-[#199FFF] bg-clip-text text-transparent">
        {text}
      </span>

      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className={`pointer-events-none absolute ${sparkle.size} text-blue-300`}
          style={{
            top: sparkle.top,
            right: sparkle.right,
            bottom: sparkle.bottom,
            left: sparkle.left,
          }}
          initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.2, 1, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
          }}
        >
          ✦
        </motion.span>
      ))}
    </span>
  );
}
