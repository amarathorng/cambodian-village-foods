// components/useLanguage.js
// Shared interface-language state ("en" | "kh"). The choice is remembered in
// localStorage and applied to <html lang> so it survives page navigation and
// reaches assistive technology. Actual archive content is never translated.
"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kla-language";
const LANGUAGES = ["en", "kh"];

export function useLanguage() {
  const [language, setLanguageState] = useState("en");

  // Read the saved choice after mount so server and client markup match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES.includes(saved)) setLanguageState(saved);
    } catch {
      // Storage unavailable (private mode): keep English.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "kh" ? "km" : "en";
  }, [language]);

  const setLanguage = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the in-memory choice still applies.
    }
  }, []);

  return [language, setLanguage];
}
