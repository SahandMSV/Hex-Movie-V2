"use client";

import { useMemo } from "react";
import { THEMES, type Theme } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";

import Button from "./ui/Button";
import Icon from "./Icon/Icon";

const THEME_ORDER: Theme[] = [...THEMES];

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const effectiveTheme: Exclude<Theme, "system"> =
    theme === "system" ? resolvedTheme : theme;

  const iconName = useMemo(() => {
    return effectiveTheme === "light" ? "sun" : "moon";
  }, [effectiveTheme]);

  const label = useMemo(() => {
    if (theme === "system") return `Theme: system (${resolvedTheme})`;
    return `Theme: ${theme}`;
  }, [theme, resolvedTheme]);

  function cycleTheme() {
    const idx = THEME_ORDER.indexOf(theme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    setTheme(next);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
        {label}
      </span>

      <Button
        type="button"
        onClick={cycleTheme}
        aria-label={label}
        small
        tertiaryMono
        pill
      >
        <Icon name={iconName} size={18} />
      </Button>
    </div>
  );
}
