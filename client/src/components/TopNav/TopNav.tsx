"use client";

import Link from "next/link";
import { useMemo } from "react";
import styles from "./TopNav.module.css";

import { useTheme } from "@/theme/ThemeProvider";
import type { Theme } from "@/theme/theme";

const THEME_ORDER: Theme[] = ["system", "light", "dark", "blue"];

export default function TopNav() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  function cycleTheme() {
    const idx = THEME_ORDER.indexOf(theme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    setTheme(next);
  }

  const themeLabel = useMemo(() => {
    if (theme === "system") return `Theme: System (${resolvedTheme})`;
    return `Theme: ${theme}`;
  }, [theme, resolvedTheme]);

  return (
    <header className={styles.shell}>
      <nav className={styles.nav} aria-label="Primary navigation">
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            HexMovie
          </Link>

          <div className={styles.tabs} aria-label="Tabs">
            <Link href="/" className={styles.tab}>
              Home
            </Link>
            <Link href="/movies" className={styles.tab}>
              Movies
            </Link>
            <Link href="/shows" className={styles.tab}>
              TV
            </Link>
            <Link href="/my-list" className={styles.tab}>
              My List
            </Link>
          </div>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={cycleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === "system" ? "System" : theme}
          </button>

          <Link href="/login" className={styles.btn}>
            Log in
          </Link>
          <Link href="/signup" className={styles.btnPrimary}>
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
