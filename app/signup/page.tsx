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
  await searchParams;

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <p className="mb-1 text-xs font-bold tracking-[0.15em] text-primary uppercase">
            B&C Packing Platform
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Create account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            New users can request role access from an admin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Sign up for Fresh Look and request role access from an admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
      </div>
    </main>
  );
}
