import { redirect } from "next/navigation";
import { DashboardNav } from "@/app/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/server";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

async function logoutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireAuth();

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Fresh Look Dashboard</h1>
            <p className="text-muted-foreground text-sm">
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

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[240px_1fr]">
        <Card className="p-4">
          <DashboardNav currentRole={context.role} />
        </Card>

        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
