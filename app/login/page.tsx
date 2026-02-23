import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_DASHBOARD_PATHS, isUserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (nextPath.startsWith("/")) {
    redirect(nextPath);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  const rolePath =
    profile && isUserRole(profile.role)
      ? ROLE_DASHBOARD_PATHS[profile.role]
      : "/growers";

  redirect(rolePath);
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold tracking-[0.15em] text-primary uppercase">
              B&C Packing Platform
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your role-based dashboard.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fresh Look Account</CardTitle>
              <CardDescription>Use your email and password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={loginAction} className="mt-4 space-y-4">
                <input type="hidden" name="next" value={params.next ?? ""} />

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>

                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>

              <p className="text-muted-foreground mt-5 text-xs">
                Role access is managed in Supabase profile records.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
