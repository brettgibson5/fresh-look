"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function formatLabel(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            {i > 0 && <span>/</span>}
            {isLast ? (
              <span className="font-medium text-foreground">
                {formatLabel(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {formatLabel(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
