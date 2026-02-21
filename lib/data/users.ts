import { createClient } from "@/lib/supabase/server";
import { isUserRole, type UserRole } from "@/lib/auth/roles";

export type ProfileSummary = {
  id: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
  created_at: string;
};

export async function listProfiles(): Promise<ProfileSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, full_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).filter((row): row is ProfileSummary => {
    return typeof row.id === "string" && isUserRole(String(row.role));
  });
}

export async function updateProfileRole(input: {
  profileId: string;
  role: UserRole;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: input.role })
    .eq("id", input.profileId);

  if (error) {
    throw new Error(error.message);
  }
}
