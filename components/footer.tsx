import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Signup", href: "/signup" },
  { label: "Progress", href: "/progress" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-8 py-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-6 px-6">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
