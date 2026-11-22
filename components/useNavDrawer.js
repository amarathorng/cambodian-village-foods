// components/useNavDrawer.js
// Drawer and scroll behaviour shared by the header: the hairline that appears
// once the page scrolls, closing the drawer after navigation, and closing it
// on Escape. Kept in its own module so Navbar stays a small composition.
"use client";

import { useEffect, useState } from "react";

export function useNavDrawer(pathname) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hairline + shadow once the page scrolls away from the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The drawer follows navigation and closes on Escape.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return { open, setOpen, scrolled };
}
