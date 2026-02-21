"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  label: string;
  href: string;
};

type RoleTabNavProps = {
  tabs: Tab[];
};

export function RoleTabNav({ tabs }: RoleTabNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-0">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              "px-5 py-2.5 text-sm font-semibold border-t border-l border-r rounded-t-md -mb-px transition-colors",
              isActive
                ? "bg-card border-border text-foreground"
                : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
