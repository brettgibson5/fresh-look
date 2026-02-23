import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isUserRole, type UserRole } from "@/lib/auth/roles";

export type ProfileSummary = {
  id: string;
  email: string | null;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned: boolean;
};

export async function listProfiles(): Promise<ProfileSummary[]> {
  const admin = createAdminClient();

  const { data: authUsers, error: authError } =
    await admin.auth.admin.listUsers();

  if (authError) {
    throw new Error(authError.message);
  }

  const supabase = await createClient();
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, role, first_name, last_name, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  const authMap = new Map(
    authUsers.users.map((u) => [
      u.id,
      {
        last_sign_in_at: u.last_sign_in_at ?? null,
        banned: !!u.banned_until && new Date(u.banned_until) > new Date(),
      },
    ]),
  );

  return (profiles ?? [])
    .filter((row): row is typeof row & { role: UserRole } =>
      isUserRole(String(row.role)),
    )
    .map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role as UserRole,
      first_name: row.first_name,
      last_name: row.last_name,
      created_at: row.created_at,
      last_sign_in_at: authMap.get(row.id)?.last_sign_in_at ?? null,
      banned: authMap.get(row.id)?.banned ?? false,
    }));
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

export async function inviteUser(input: { email: string; role: UserRole }) {
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.inviteUserByEmail(input.email);

  if (error) {
    throw new Error(error.message);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ role: input.role })
    .eq("id", data.user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }
}

export async function updateUserEmail(input: {
  userId: string;
  email: string;
}) {
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    email: input.email,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ email: input.email })
    .eq("id", input.userId);

  if (profileError) {
    throw new Error(profileError.message);
  }
}

export async function updateUserName(input: {
  profileId: string;
  firstName: string;
  lastName: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName || null,
      last_name: input.lastName || null,
    })
    .eq("id", input.profileId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteUser(input: { userId: string }) {
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(input.userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendPasswordReset(input: { email: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(input.email);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setUserBanned(input: {
  userId: string;
  banned: boolean;
}) {
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    ban_duration: input.banned ? "876000h" : "none",
  });

  if (error) {
    throw new Error(error.message);
  }
}
