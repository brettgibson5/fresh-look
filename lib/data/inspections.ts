import { createClient } from "@/lib/supabase/server";

export type InspectionResult = "pass" | "fail";

export async function submitInspection(input: {
  workItemId: string;
  qcUserId: string;
  result: InspectionResult;
  notes: string;
}) {
  const supabase = await createClient();

  const { error: inspectionError } = await supabase.from("inspections").insert({
    work_item_id: input.workItemId,
    qc_user_id: input.qcUserId,
    result: input.result,
    notes: input.notes || null,
  });

  if (inspectionError) {
    throw new Error(inspectionError.message);
  }

  const nextStatus = input.result === "pass" ? "passed" : "failed";

  const { error: workItemError } = await supabase
    .from("work_items")
    .update({
      status: nextStatus,
      qc_reviewed_at: new Date().toISOString(),
    })
    .eq("id", input.workItemId)
    .eq("status", "pending");

  if (workItemError) {
    throw new Error(workItemError.message);
  }
}
