"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

function normalize(value: string) {
  return value.normalize("NFKC");
}

export function PasswordForm({ action }: PasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const matchState = useMemo(() => {
    const normalizedPassword = normalize(password);
    const normalizedConfirm = normalize(confirmPassword);

    if (!normalizedConfirm) {
      return "idle" as const;
    }

    return normalizedPassword === normalizedConfirm
      ? ("match" as const)
      : ("mismatch" as const);
  }, [password, confirmPassword]);

  return (
    <form
      action={action}
      className="grid gap-3 md:max-w-md"
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        const password = normalize(String(formData.get("password") ?? ""));
        const confirmPassword = normalize(
          String(formData.get("confirmPassword") ?? ""),
        );

        if (password !== confirmPassword) {
          event.preventDefault();
          toast.error("Passwords do not match");
        }
      }}
    >
      <Label htmlFor="password">New password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
      />

      <Label htmlFor="confirmPassword">Confirm new password</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
      />

      {matchState === "match" ? (
        <p className="text-primary text-sm" role="status" aria-live="polite">
          Passwords match
        </p>
      ) : null}

      {matchState === "mismatch" ? (
        <p
          className="text-destructive text-sm"
          role="status"
          aria-live="polite"
        >
          Passwords do not match
        </p>
      ) : null}

      <Button type="submit" className="w-fit">
        Update password
      </Button>
    </form>
  );
}
