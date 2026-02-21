import { requireAuth } from "@/lib/auth/server";

export default async function PackingChecklistPage() {
  await requireAuth();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-4xl mb-4">✅</p>
      <h2 className="text-2xl font-extrabold tracking-tight">Packing Checklist</h2>
      <p className="text-muted-foreground mt-2 text-sm">Coming soon.</p>
    </div>
  );
}
