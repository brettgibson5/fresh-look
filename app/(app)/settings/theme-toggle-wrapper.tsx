"use client";

import dynamic from "next/dynamic";

const ThemeToggle = dynamic(
  () =>
    import("@/app/dashboard/settings/theme-toggle").then(
      (mod) => mod.ThemeToggle,
    ),
  { ssr: false },
);

export function ThemeToggleWrapper() {
  return <ThemeToggle />;
}
