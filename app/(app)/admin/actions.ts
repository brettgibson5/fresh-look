"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/server";
import { isUserRole } from "@/lib/auth/roles";
import {
  deleteUser,
  inviteUser,
  sendPasswordReset,
  setUserBanned,
  updateProfileRole,
  updateUserEmail,
  updateUserName,
} from "@/lib/data/users";

export async function inviteUserAction(formData: FormData) {
  await requireRole(["admin"]);

  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!email || !isUserRole(role)) {
    return { error: "Invalid email or role." };
  }

  try {
    await inviteUser({ email, role });
    revalidatePath("/admin/users");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to invite user." };
  }
}

export async function updateUserNameAction(formData: FormData) {
  await requireRole(["admin"]);

  const profileId = String(formData.get("profileId") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!profileId) return { error: "Missing user ID." };

  try {
    await updateUserName({ profileId, firstName, lastName });
    revalidatePath("/admin/users");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update name." };
  }
}

export async function updateUserEmailAction(formData: FormData) {
  await requireRole(["admin"]);

  const userId = String(formData.get("userId") ?? "");
  const email = String(formData.get("email") ?? "").trim();

  if (!userId || !email) return { error: "Missing user ID or email." };

  try {
    await updateUserEmail({ userId, email });
    revalidatePath("/admin/users");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update email." };
  }
}

export async function updateRoleAction(formData: FormData) {
  await requireRole(["admin"]);

  const profileId = String(formData.get("profileId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!profileId || !isUserRole(role)) return;

  try {
    await updateProfileRole({ profileId, role });
    revalidatePath("/admin/users");
  } catch {
    // silently ignore inline role change errors
  }
}

export async function sendPasswordResetAction(formData: FormData) {
  await requireRole(["admin"]);

  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { error: "Missing email." };

  try {
    await sendPasswordReset({ email });
    revalidatePath("/admin/users");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to send reset." };
  }
}

export async function setBannedAction(formData: FormData) {
  await requireRole(["admin"]);

  const userId = String(formData.get("userId") ?? "");
  const banned = formData.get("banned") === "true";

  if (!userId) return { error: "Missing user ID." };

  try {
    await setUserBanned({ userId, banned });
    revalidatePath("/admin/users");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update ban status." };
  }
}

export async function deleteUserAction(formData: FormData) {
  await requireRole(["admin"]);

  const userId = String(formData.get("userId") ?? "");

  if (!userId) return { error: "Missing user ID." };

  try {
    await deleteUser({ userId });
    revalidatePath("/admin/users");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete user." };
  }
}
