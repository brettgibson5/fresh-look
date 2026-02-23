"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditDialog } from "./edit-dialog";
import {
  deleteUserAction,
  sendPasswordResetAction,
  setBannedAction,
} from "./actions";

type User = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  banned: boolean;
};

type ConfirmDialog =
  | { type: "reset" }
  | { type: "ban" }
  | { type: "delete" }
  | null;

export function UserActionsMenu({ user }: { user: User }) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmDialog>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(formData: FormData, action: (fd: FormData) => Promise<{ error?: string } | undefined>) {
    setPending(true);
    setError(null);
    const result = await action(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setConfirm(null);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirm({ type: "reset" })}>
            Send Password Reset
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirm({ type: "ban" })}>
            {user.banned ? "Unban" : "Ban"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setConfirm({ type: "delete" })}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
      />

      <Dialog open={confirm !== null} onOpenChange={(o) => { if (!o) setConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm?.type === "reset" && "Send Password Reset"}
              {confirm?.type === "ban" && (user.banned ? "Unban User" : "Ban User")}
              {confirm?.type === "delete" && "Delete User"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            {confirm?.type === "reset" &&
              `Send a password reset email to ${user.email}?`}
            {confirm?.type === "ban" &&
              (user.banned
                ? `Unban ${user.email}? They will be able to log in again.`
                : `Ban ${user.email}? They will not be able to log in.`)}
            {confirm?.type === "delete" &&
              `Permanently delete ${user.email}? This cannot be undone.`}
          </p>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm?.type === "delete" ? "destructive" : "default"}
              disabled={pending}
              onClick={() => {
                const fd = new FormData();
                if (confirm?.type === "reset" && user.email) {
                  fd.set("email", user.email);
                  runAction(fd, sendPasswordResetAction);
                } else if (confirm?.type === "ban") {
                  fd.set("userId", user.id);
                  fd.set("banned", String(!user.banned));
                  runAction(fd, setBannedAction);
                } else if (confirm?.type === "delete") {
                  fd.set("userId", user.id);
                  runAction(fd, deleteUserAction);
                }
              }}
            >
              {pending
                ? "Working…"
                : confirm?.type === "reset"
                  ? "Send"
                  : confirm?.type === "ban"
                    ? user.banned ? "Unban" : "Ban"
                    : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
