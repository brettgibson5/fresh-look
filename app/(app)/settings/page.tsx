import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ConfirmSubmitButton } from "@/app/(app)/settings/confirm-submit-button";
import { PasswordForm } from "@/app/(app)/settings/password-form";
import { ThemeToggleWrapper } from "@/app/(app)/settings/theme-toggle-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAuth } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

type SettingsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

function getAvatarObjectPathFromPublicUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/avatars/";
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const rawPath = url.slice(markerIndex + marker.length);
  const cleanPath = rawPath.split("?")[0];

  return cleanPath || null;
}

async function updateDisplayNameAction(formData: FormData) {
  "use server";

  const context = await requireAuth();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ first_name: firstName || null, last_name: lastName || null })
    .eq("id", context.userId);

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/settings");
  redirect("/settings?success=Name%20updated");
}

async function updatePasswordAction(formData: FormData) {
  "use server";

  await requireAuth();
  const password = String(formData.get("password") ?? "").normalize("NFKC");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  ).normalize("NFKC");

  if (!password || password.length < 8) {
    redirect(
      "/settings?error=Password%20must%20be%20at%20least%208%20characters",
    );
  }

  if (password !== confirmPassword) {
    redirect("/settings?error=Passwords%20do%20not%20match");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/settings?success=Password%20updated");
}

async function updatePhotoAction(formData: FormData) {
  "use server";

  const context = await requireAuth();
  const avatar = formData.get("avatar");

  if (!(avatar instanceof File) || avatar.size === 0) {
    redirect("/settings?error=Please%20select%20an%20image%20file");
  }

  const safeName = avatar.name.replace(/\s+/g, "-").toLowerCase();
  const objectPath = `${context.userId}/${Date.now()}-${safeName}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(objectPath, avatar, {
      cacheControl: "3600",
      upsert: true,
      contentType: avatar.type,
    });

  if (uploadError) {
    redirect(
      `/settings?error=${encodeURIComponent(uploadError.message)}`,
    );
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(objectPath);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", context.userId);

  if (profileError) {
    redirect(
      `/settings?error=${encodeURIComponent(profileError.message)}`,
    );
  }

  revalidatePath("/settings");
  redirect("/settings?success=Photo%20updated");
}

async function deletePhotoAction() {
  "use server";

  const context = await requireAuth();
  const supabase = await createClient();

  const { data: profile, error: profileFetchError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", context.userId)
    .maybeSingle();

  if (profileFetchError) {
    redirect(
      `/settings?error=${encodeURIComponent(profileFetchError.message)}`,
    );
  }

  const currentAvatarUrl = profile?.avatar_url;
  if (currentAvatarUrl) {
    const objectPath = getAvatarObjectPathFromPublicUrl(currentAvatarUrl);

    if (objectPath) {
      const { error: removeError } = await supabase.storage
        .from("avatars")
        .remove([objectPath]);

      if (removeError) {
        redirect(
          `/settings?error=${encodeURIComponent(removeError.message)}`,
        );
      }
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", context.userId);

  if (updateError) {
    redirect(
      `/settings?error=${encodeURIComponent(updateError.message)}`,
    );
  }

  revalidatePath("/settings");
  redirect("/settings?success=Photo%20deleted");
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  await searchParams;
  const context = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, avatar_url")
    .eq("id", context.userId)
    .maybeSingle();

  const initials = (
    profile?.first_name?.charAt(0) ||
    profile?.email?.charAt(0) ||
    "U"
  ).toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage your account profile, security, and app appearance.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Name</h3>
        <form
          action={updateDisplayNameAction}
          className="grid gap-3 md:max-w-md"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={profile?.first_name ?? ""}
                placeholder="First"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={profile?.last_name ?? ""}
                placeholder="Last"
              />
            </div>
          </div>
          <Button type="submit" className="w-fit">
            Save name
          </Button>
        </form>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Profile photo</h3>
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Profile photo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border object-cover"
              unoptimized
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-16 w-16 items-center justify-center rounded-full border text-lg font-medium">
              {initials}
            </div>
          )}
          <div className="text-muted-foreground text-sm">
            {profile?.avatar_url ? "Current photo" : "No photo uploaded yet"}
          </div>
        </div>

        {profile?.avatar_url ? (
          <div className="flex items-center gap-3">
            <a
              href={profile.avatar_url}
              target="_blank"
              rel="noreferrer"
              className="text-primary text-sm underline"
            >
              View current photo
            </a>
            <form action={deletePhotoAction}>
              <ConfirmSubmitButton confirmMessage="Delete your profile photo?">
                Delete photo
              </ConfirmSubmitButton>
            </form>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No photo uploaded yet.
          </p>
        )}
        <form action={updatePhotoAction} className="grid gap-3 md:max-w-md">
          <Label htmlFor="avatar">Upload photo</Label>
          <Input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            required
          />
          <Button type="submit" className="w-fit">
            Upload photo
          </Button>
        </form>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Change password</h3>
        <PasswordForm action={updatePasswordAction} />
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Theme</h3>
        <p className="text-muted-foreground text-sm">
          Choose light or dark mode.
        </p>
        <ThemeToggleWrapper />
      </section>
    </div>
  );
}
