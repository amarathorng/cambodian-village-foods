// components/NavMenu.js
// Primary navigation links with an animated active indicator. On the home
// page the indicator follows the section in view (collection, introduction,
// about); elsewhere it follows the current route.
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SECTION_IDS = ["collection", "introduction", "about"];

export default function NavMenu({ links, label = "Primary", onNavigate }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href) => {
    const [path, hash] = href.split("#");
    const target = path || "/";
    if (target !== "/") {
      return pathname === target || pathname.startsWith(`${target}/`);
    }
    if (hash) return pathname === "/" && activeSection === hash;
    return pathname === "/" && !activeSection;
  };

  return (
    <nav className="nav-links" aria-label={label}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="nav-link"
          aria-current={isActive(link.href) ? "page" : undefined}
          onClick={onNavigate}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
