import Link from "next/link";
import { redirect } from "next/navigation";
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
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath.startsWith("/") ? nextPath : "/dashboard");
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <Card>
        <CardHeader>
          <CardTitle>Fresh Look Login</CardTitle>
          <CardDescription>Sign in with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {params.error ? (
            <p className="text-destructive bg-destructive/10 mt-1 rounded-md px-3 py-2 text-sm">
              {params.error}
            </p>
          ) : null}

          <form action={loginAction} className="mt-4 space-y-4">
            <input
              type="hidden"
              name="next"
              value={params.next ?? "/dashboard"}
            />

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

      <Link
        href="/"
        className="text-muted-foreground mt-6 text-center text-sm underline"
      >
        Back to home
      </Link>
    </main>
  );
}
