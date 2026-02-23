"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserEmailAction, updateUserNameAction } from "./actions";

type EditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  };
};

export function EditDialog({ open, onOpenChange, user }: EditDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const nameResult = await updateUserNameAction(formData);
    if (nameResult?.error) {
      setError(nameResult.error);
      setPending(false);
      return;
    }

    const emailResult = await updateUserEmailAction(formData);
    if (emailResult?.error) {
      setError(emailResult.error);
      setPending(false);
      return;
    }

    setPending(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 pt-2">
          <input type="hidden" name="profileId" value={user.id} />
          <input type="hidden" name="userId" value={user.id} />
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="edit-first">First name</Label>
              <Input
                id="edit-first"
                name="firstName"
                defaultValue={user.first_name ?? ""}
                placeholder="First"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-last">Last name</Label>
              <Input
                id="edit-last"
                name="lastName"
                defaultValue={user.last_name ?? ""}
                placeholder="Last"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
