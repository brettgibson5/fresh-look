import { requireRole } from "@/lib/auth/server";

export default async function GrowersQualityControlPage() {
  await requireRole(["growers", "management", "admin"]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-4xl mb-4">✅</p>
      <h2 className="text-2xl font-extrabold tracking-tight">Quality Control</h2>
      <p className="text-muted-foreground mt-2 text-sm">Coming soon.</p>
    </div>
  );
}
