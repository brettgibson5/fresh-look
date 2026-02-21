import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/server";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

async function logoutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-to-br from-[#0a1628] to-[#0f1f3d]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.15em] text-primary uppercase">
              FreshLook Platform
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

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
