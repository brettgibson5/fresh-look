import { createClient } from "@/lib/supabase/server";

export type WorkItemStatus = "pending" | "passed" | "failed";

export type WorkItem = {
  id: string;
  grower_id: string;
  title: string;
  lot_code: string;
  notes: string | null;
  status: WorkItemStatus;
  qc_reviewed_at: string | null;
  created_at: string;
};

export type ManagementKpi = {
  total: number;
  pending: number;
  passed: number;
  failed: number;
  passRate: number;
};

export async function listRecentWorkItems(limit = 10): Promise<WorkItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("work_items")
    .select(
      "id, grower_id, title, lot_code, notes, status, qc_reviewed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as WorkItem[];
}

export async function listGrowerWorkItems(userId: string): Promise<WorkItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("work_items")
    .select(
      "id, grower_id, title, lot_code, notes, status, qc_reviewed_at, created_at",
    )
    .eq("grower_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as WorkItem[];
}

export async function createGrowerWorkItem(input: {
  userId: string;
  title: string;
  lotCode: string;
  notes: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("work_items").insert({
    grower_id: input.userId,
    title: input.title,
    lot_code: input.lotCode,
    notes: input.notes || null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateGrowerWorkItem(input: {
  userId: string;
  itemId: string;
  title: string;
  lotCode: string;
  notes: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("work_items")
    .update({
      title: input.title,
      lot_code: input.lotCode,
      notes: input.notes || null,
    })
    .eq("id", input.itemId)
    .eq("grower_id", input.userId)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }
}

export async function listQcQueue(): Promise<WorkItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("work_items")
    .select(
      "id, grower_id, title, lot_code, notes, status, qc_reviewed_at, created_at",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as WorkItem[];
}

export async function getManagementKpis(): Promise<ManagementKpi> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("work_items")
    .select("status", { count: "exact" });

  if (error) {
    throw new Error(error.message);
  }

  const total = data?.length ?? 0;
  const pending = data?.filter((item) => item.status === "pending").length ?? 0;
  const passed = data?.filter((item) => item.status === "passed").length ?? 0;
  const failed = data?.filter((item) => item.status === "failed").length ?? 0;
  const passRate =
    passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0;

  return {
    total,
    pending,
    passed,
    failed,
    passRate,
  };
}
