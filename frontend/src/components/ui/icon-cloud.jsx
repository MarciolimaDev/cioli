"use client";

import { useEffect, useMemo, useState } from "react";
import { Cloud, fetchSimpleIcons, renderSimpleIcon } from "react-icon-cloud";

export default function IconCloud({ iconSlugs = [] }) {
  const [iconData, setIconData] = useState(null);

  useEffect(() => {
    let active = true;

    fetchSimpleIcons({ slugs: iconSlugs }).then((data) => {
      if (active) {
        setIconData(data.simpleIcons);
      }
    });

    return () => {
      active = false;
    };
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!iconData) return [];

    return Object.values(iconData).map((icon) =>
      renderSimpleIcon({
        icon,
        size: 58,
        minContrastRatio: 1.1,
        bgHex: "#020617",
        fallbackHex: "#e2e8f0",
        aProps: {
          href: "#",
          onClick: (event) => event.preventDefault(),
        },
      })
    );
  }, [iconData]);

  const cloudOptions = useMemo(
    () => ({
      reverse: true,
      depth: 1,
      wheelZoom: false,
      imageScale: 1.25,
      activeCursor: "default",
      tooltip: "native",
      initial: [0.04, -0.04],
      clickToFront: 0,
      tooltipDelay: 0,
      outlineColour: "rgba(0,0,0,0)",
      maxSpeed: 0.025,
      minSpeed: 0.008,
      dragControl: false,
      freezeActive: false,
      freezeDecel: true,
      decel: 0.985,
    }),
    []
  );

  return (
    <div className="relative h-[360px] w-[360px] select-none">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16)_0%,rgba(2,6,23,0)_72%)]" />

      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2">
        <Cloud options={cloudOptions}>{renderedIcons}</Cloud>
      </div>
    </div>
  );
}
