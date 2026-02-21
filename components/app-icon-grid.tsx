import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type AppIcon = {
  label: string;
  href: string;
  icon: LucideIcon;
  color?: string;
};

type AppIconGridProps = {
  icons: AppIcon[];
};

export function AppIconGrid({ icons }: AppIconGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 sm:gap-6">
      {icons.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border bg-card shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md"
              style={item.color ? { borderColor: `${item.color}40`, background: `${item.color}12` } : undefined}
            >
              <Icon
                className="h-7 w-7 sm:h-9 sm:w-9"
                style={item.color ? { color: item.color } : undefined}
              />
            </div>
            <span className="text-center text-xs font-medium leading-tight text-foreground">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
