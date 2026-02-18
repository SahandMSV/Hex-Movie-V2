"use client";

import { useMemo } from "react";
import Link from "next/link";

import Button from "../ui/Button";
import Icon from "../Icon/Icon";
import styles from "./TopNav.module.css";

import { useTheme } from "../../theme/ThemeProvider";
import type { Theme } from "../../theme/theme";

const THEME_ORDER: Theme[] = ["system", "dark", "light", "blue"];

export default function TopNav() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  function cycleTheme() {
    const idx = THEME_ORDER.indexOf(theme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    setTheme(next);
  }

  const effectiveTheme: Exclude<Theme, "system"> =
    theme === "system" ? resolvedTheme : theme;

  const themeIcon = useMemo(() => {
    // Light => sun, Dark/Blue => moon, System follows resolvedTheme automatically
    return effectiveTheme === "light" ? "sun" : "moon";
  }, [effectiveTheme]);

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
          <Button
            type="button"
            onClick={cycleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            small
            tertiaryMono
            pill
          >
            <Icon name={themeIcon} size={18} className="icon" />
            {theme === "system" ? "System" : theme}
          </Button>

          <Button href="/login" small secondary pill>
            Log in
          </Button>

          <Button href="/signup" small primary pill>
            Sign up
          </Button>
        </div>
      </nav>
    </header>
  );
}
