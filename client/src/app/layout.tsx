import type { Metadata } from "next";
import { cookies, headers } from "next/headers";

import ThemeProvider from "../theme/ThemeProvider";
import { isTheme, type Theme } from "../theme/theme";

import "../styles/theme.css";
import "./globals.css";


export const metadata: Metadata = {
  title: "Hex Movie",
  description: "Hex Movie",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={initialTheme !== "system" ? initialTheme : undefined}
    >
      <body>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
