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
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1187299/pexels-photo-1187299.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/35 to-black/60" />

      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/20 absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-accent/50 absolute right-[-120px] bottom-[-120px] h-80 w-80 rounded-full blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-primary-foreground/80 text-sm uppercase tracking-[0.2em]">
            Fresh Look Platform
          </p>
          <h1 className="text-primary-foreground max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            From field to facility, quality stays visible at every step.
          </h1>
          <p className="text-primary-foreground/85 max-w-2xl text-base leading-7 sm:text-lg">
            Fresh Look helps growers, quality control teams, sanitation, and
            management stay aligned with one shared workflow for lot tracking,
            inspections, and operational visibility.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>

        <Card className="border-0 bg-black/30 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              Built for agriculture teams
            </CardTitle>
            <CardDescription className="text-white/80">
              Role-based dashboards for growers, quality control, management,
              sanitation, and admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-6 text-white/90">
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
