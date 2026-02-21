import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth/server";
import {
  createGrowerWorkItem,
  listRecentWorkItems,
  listGrowerWorkItems,
  updateGrowerWorkItem,
} from "@/lib/data/work-items";

async function createWorkItemAction(formData: FormData) {
  "use server";

  const context = await requireRole(["growers"]);
  const title = String(formData.get("title") ?? "").trim();
  const lotCode = String(formData.get("lotCode") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title || !lotCode) {
    return;
  }

  await createGrowerWorkItem({
    userId: context.userId,
    title,
    lotCode,
    notes,
  });

  revalidatePath("/dashboard/growers");
}

async function updateWorkItemAction(formData: FormData) {
  "use server";

  const context = await requireRole(["growers"]);
  const itemId = String(formData.get("itemId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const lotCode = String(formData.get("lotCode") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!itemId || !title || !lotCode) {
    return;
  }

  await updateGrowerWorkItem({
    userId: context.userId,
    itemId,
    title,
    lotCode,
    notes,
  });

  revalidatePath("/dashboard/growers");
}

export default async function GrowersDashboardPage() {
  const context = await requireRole(["growers", "management", "admin"]);
  const isGrower = context.role === "growers";
  const workItems = isGrower
    ? await listGrowerWorkItems(context.userId)
    : await listRecentWorkItems(20);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Growers</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        {isGrower
          ? "Submit and maintain your work items before QC review."
          : "Read-only view for management/admin."}
      </p>

      {isGrower ? (
        <form
          action={createWorkItemAction}
          className="mt-6 grid gap-3 rounded-lg border p-4"
        >
          <h3 className="font-medium">New work item</h3>
          <Input name="title" placeholder="Title" required />
          <Input name="lotCode" placeholder="Lot code" required />
          <Textarea name="notes" placeholder="Notes" rows={3} />
          <Button type="submit" className="w-fit">
            Create item
          </Button>
        </form>
      ) : null}

      <div className="mt-6 space-y-4">
        {workItems.map((item) => {
          const isPending = item.status === "pending";
          const canEdit = isGrower && isPending;

          return (
            <form
              key={item.id}
              action={updateWorkItemAction}
              className="grid gap-3 rounded-lg border p-4"
            >
              <input type="hidden" name="itemId" value={item.id} />
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{item.title}</h4>
                <Badge variant={isPending ? "secondary" : "outline"}>
                  {item.status}
                </Badge>
              </div>
              <Input
                name="title"
                defaultValue={item.title}
                disabled={!canEdit}
                required
              />
              <Input
                name="lotCode"
                defaultValue={item.lot_code}
                disabled={!canEdit}
                required
              />
              <Textarea
                name="notes"
                defaultValue={item.notes ?? ""}
                rows={3}
                disabled={!canEdit}
              />
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs">
                  Created: {new Date(item.created_at).toLocaleString()}
                </p>
                {canEdit ? (
                  <Button type="submit" size="sm" variant="outline">
                    Save changes
                  </Button>
                ) : null}
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
