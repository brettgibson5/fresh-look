"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROLE_LABELS, USER_ROLES } from "@/lib/auth/roles";
import type { ProfileSummary } from "@/lib/data/users";
import { updateRoleAction } from "../actions";
import { InviteDialog } from "../invite-dialog";
import { UserActionsMenu } from "../user-actions-menu";

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UsersTable({ profiles }: { profiles: ProfileSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.email ?? "").toLowerCase().includes(q) ||
      (p.first_name ?? "").toLowerCase().includes(q) ||
      (p.last_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <InviteDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Sign-In</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell className="text-sm">{profile.email ?? "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—"}
              </TableCell>
              <TableCell>
                <select
                  name="role"
                  defaultValue={profile.role}
                  className="bg-background h-8 rounded-md border px-2 text-sm"
                  onChange={(e) => {
                    const fd = new FormData();
                    fd.set("profileId", profile.id);
                    fd.set("role", e.target.value);
                    updateRoleAction(fd);
                  }}
                >
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(profile.last_sign_in_at)}
              </TableCell>
              <TableCell>
                <Badge variant={profile.banned ? "destructive" : "secondary"}>
                  {profile.banned ? "Banned" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <UserActionsMenu user={profile} />
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-8 text-center text-sm"
              >
                {search ? "No users match your search." : "No users found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
