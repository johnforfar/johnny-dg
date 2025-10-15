"use client";

import { ThemeProvider } from "next-themes";
import { MiniAppProvider } from "./miniapp-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <MiniAppProvider>
        {children}
      </MiniAppProvider>
    </ThemeProvider>
  );
}
