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

type SignUpPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

async function signUpAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/signup?error=Email%20and%20password%20are%20required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/signup?success=Account%20created.%20You%20can%20now%20log%20in.");
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Sign up for Fresh Look and request role access from an admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {params.error ? (
            <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-sm">
              {params.error}
            </p>
          ) : null}

          {params.success ? (
            <p className="bg-primary/10 text-primary rounded-md px-3 py-2 text-sm">
              {params.success}
            </p>
          ) : null}

          <form action={signUpAction} className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>

          <p className="text-muted-foreground mt-5 text-xs">
            New users default to grower role until changed by admin.
          </p>
        </CardContent>
      </Card>

      <div className="text-muted-foreground mt-6 flex items-center justify-center gap-2 text-sm">
        <span>Already have an account?</span>
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </main>
  );
}
