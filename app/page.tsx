import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-to-br from-[#0a1628] to-[#0f1f3d]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-8">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.15em] text-primary uppercase">
              FreshLookAg × B&C Packing
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              App Architecture Overview
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Data models · UI views · Priority breakdown
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-1">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-balance">
              From field to facility, quality stays visible at every step.
            </CardTitle>
            <CardDescription className="text-sm leading-6">
              Fresh Look helps growers, quality control teams, sanitation, and
              management stay aligned with one shared workflow for lot tracking,
              inspections, and operational visibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Sign up</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/progress">Client progress</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-1">
          <CardHeader>
            <CardTitle className="text-lg">
              Built for agriculture teams
            </CardTitle>
            <CardDescription>
              Role-based dashboards for growers, quality control, management,
              sanitation, and admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>• Growers submit and track work items by lot.</li>
              <li>• QC records pass/fail inspections in real time.</li>
              <li>• Management monitors throughput and pass rate.</li>
              <li>• Admin manages secure role access.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
