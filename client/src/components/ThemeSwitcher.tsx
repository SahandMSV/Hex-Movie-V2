"use client";

import React from "react";
import { THEMES, type Theme } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
        Theme: {theme} (resolved: {resolvedTheme})
      </span>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        style={{
          background: "var(--bg-tertiary)",
          color: "var(--text-primary)",
          border: `1px solid var(--border-color)`,
          borderRadius: 10,
          padding: "8px 10px",
        }}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
