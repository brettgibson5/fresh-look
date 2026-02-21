"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  const setMode = (nextTheme: Theme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={theme === "light" ? "default" : "outline"}
        onClick={() => setMode("light")}
      >
        Light
      </Button>
      <Button
        type="button"
        variant={theme === "dark" ? "default" : "outline"}
        onClick={() => setMode("dark")}
      >
        Dark
      </Button>
    </div>
  );
}
