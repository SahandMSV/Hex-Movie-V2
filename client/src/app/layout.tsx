import type { Metadata } from "next";
import { cookies, headers } from "next/headers";

import ThemeProvider from "../theme/ThemeProvider";
import { isTheme, type Theme } from "../theme/theme";
import { headingFont, bodyFont } from "../styles/fonts";

import "./index.css";

export const metadata: Metadata = {
  title: "Hex Movie",
  description: "Hex Movie",
};

function themeToHtmlClass(theme: Theme): string {
  if (theme === "system") return "";
  return theme;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const headerThemeRaw = h.get("x-theme");

  const cookieStore = await cookies();
  const cookieThemeRaw = cookieStore.get("theme")?.value;

  const headerTheme = isTheme(headerThemeRaw)
    ? (headerThemeRaw as Theme)
    : undefined;

  const cookieTheme = isTheme(cookieThemeRaw)
    ? (cookieThemeRaw as Theme)
    : undefined;

  const initialTheme: Theme = headerTheme ?? cookieTheme ?? "system";

  const themeClass = themeToHtmlClass(initialTheme);

  const htmlClassName =
    `${headingFont.variable} ${bodyFont.variable} ${themeClass}`.trim();

  return (
    <html lang="en" suppressHydrationWarning className={htmlClassName}>
      <body>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
