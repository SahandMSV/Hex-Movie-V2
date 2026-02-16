"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Theme } from "./theme";
import { isTheme } from "./theme";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Exclude<Theme, "system">;
  setTheme: (newTheme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): Exclude<Theme, "system"> {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyHtmlClass(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Remove theme classes, add when not system.
  root.classList.remove("light", "dark", "blue");

  if (theme !== "system") {
    root.classList.add(theme);
  }
}

function persistThemeCookie(theme: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `theme=${theme}; Path=/; Max-Age=${365 * 24 * 60 * 60}; SameSite=Strict`;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: Theme;
};

export default function ThemeProvider({
  children,
  initialTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    isTheme(initialTheme) ? initialTheme : "system",
  );
  const [systemTheme, setSystemTheme] = useState<Exclude<Theme, "system">>(() =>
    getSystemTheme(),
  );

  // Track system theme changes so resolvedTheme updates while user is on "system".
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemTheme(mql.matches ? "dark" : "light");

    update();
    // Safari compatibility
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    } else {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, []);

  // Keep DOM + cookie in sync
  useLayoutEffect(() => {
    applyHtmlClass(theme);
    persistThemeCookie(theme);
  }, [theme]);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (t) => setThemeState(t),
    }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
