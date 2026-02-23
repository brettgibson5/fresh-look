import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { RoleTabNav } from "@/components/role-tab-nav";
import { requireAuth } from "@/lib/auth/server";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

async function logoutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const GROWER_TABS = [
  { label: "Growers", href: "/growers" },
  { label: "Settings", href: "/settings" },
];

const PACKING_EMPLOYEE_TABS = [
  { label: "Packing Employee", href: "/packing-employee" },
  { label: "Settings", href: "/settings" },
];

const MANAGEMENT_TABS = [
  { label: "Growers", href: "/growers" },
  { label: "Packing Employee", href: "/packing-employee" },
  { label: "Settings", href: "/settings" },
];

const ADMIN_TABS = [
  { label: "Growers", href: "/growers" },
  { label: "Packing Employee", href: "/packing-employee" },
  { label: "Admin", href: "/admin" },
  { label: "Settings", href: "/settings" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireAuth();

  const tabs =
    context.role === "admin"
      ? ADMIN_TABS
      : context.role === "management"
        ? MANAGEMENT_TABS
        : context.role === "packing_employee"
          ? PACKING_EMPLOYEE_TABS
          : GROWER_TABS;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card dark:bg-linear-to-br dark:from-[#0a1628] dark:to-[#0f1f3d]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.15em] text-primary uppercase">
              B&C Packing Platform
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              Fresh Look
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {ROLE_LABELS[context.role]}
            </p>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </header>

      {tabs && (
        <div className="border-b border-border bg-card">
          <div className="mx-auto w-full max-w-7xl px-6 pt-4">
            <RoleTabNav tabs={tabs} />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
    </div>
  );
}
