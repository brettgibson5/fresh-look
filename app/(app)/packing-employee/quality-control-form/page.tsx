import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth/server";
import { submitInspection } from "@/lib/data/inspections";
import { listQcQueue } from "@/lib/data/work-items";

async function inspectAction(formData: FormData) {
  "use server";

  const context = await requireRole(["packing_employee", "admin"]);
  const workItemId = String(formData.get("workItemId") ?? "");
  const result = String(formData.get("result") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!workItemId || (result !== "pass" && result !== "fail")) {
    return;
  }

  await submitInspection({
    workItemId,
    qcUserId: context.userId,
    result,
    notes,
  });

  revalidatePath("/quality-control-form");
  revalidatePath("/management");
}

export default async function QualityControlDashboardPage() {
  const context = await requireRole(["packing_employee", "management", "admin"]);
  const canInspect =
    context.role === "packing_employee" || context.role === "admin";
  const queue = await listQcQueue();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Quality Control</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        {canInspect
          ? "Review pending items and record a pass/fail decision."
          : "Read-only queue view for management."}
      </p>

      <div className="mt-6 space-y-4">
        {queue.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending items.</p>
        ) : null}

        {queue.map((item) => (
          <form
            key={item.id}
            action={inspectAction}
            className="grid gap-3 rounded-lg border p-4"
          >
            <input type="hidden" name="workItemId" value={item.id} />
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{item.title}</h4>
              <Badge variant="secondary">{item.status}</Badge>
            </div>
            <p className="text-sm">Lot: {item.lot_code}</p>
            <p className="text-muted-foreground text-sm">
              {item.notes ?? "No notes"}
            </p>
            <div className="grid gap-2 md:max-w-xs">
              <label
                htmlFor={`result-${item.id}`}
                className="text-sm font-medium"
              >
                Result
              </label>
              <select
                id={`result-${item.id}`}
                name="result"
                className="bg-background h-9 rounded-md border px-2 text-sm"
                defaultValue="pass"
                disabled={!canInspect}
              >
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            </div>
            <Textarea
              name="notes"
              rows={3}
              placeholder="Inspection notes"
              disabled={!canInspect}
            />
            {canInspect ? (
              <Button type="submit" className="w-fit">
                Submit inspection
              </Button>
            ) : null}
          </form>
        ))}
      </div>
    </div>
  );
}
