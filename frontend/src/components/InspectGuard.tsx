"use client";

import { useEffect } from "react";

type InspectGuardProps = {
  redirectUrl?: string;
};

export default function InspectGuard({
  redirectUrl = "about:blank",
}: InspectGuardProps) {
  useEffect(() => {
   // Disable protection on localhost
   const isLocalhost = typeof window !== "undefined" && 
     (window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1");
   
   if (isLocalhost) return;

    const leaveSite = () => {
      window.location.replace(redirectUrl);
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      leaveSite();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blockedShortcut =
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && key === "u");

      if (!blockedShortcut) return;

      event.preventDefault();
      leaveSite();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [redirectUrl]);

  return null;
}
