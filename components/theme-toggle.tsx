"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "clay-button flex items-center justify-center gap-2 bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        "w-full",
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <Sun className="size-4" />
          Light mode
        </>
      ) : (
        <>
          <Moon className="size-4" />
          Dark mode
        </>
      )}
    </button>
  );
}
