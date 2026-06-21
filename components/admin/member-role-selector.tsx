"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRoleAction } from "@/app/actions/admin";

type Role = "MEMBER" | "COACH" | "WELFARE_OFFICER" | "COMMITTEE" | "ADMIN";

const LABELS: Record<Role, string> = {
  MEMBER: "Member",
  COACH: "Coach",
  WELFARE_OFFICER: "Welfare officer",
  COMMITTEE: "Committee",
  ADMIN: "Admin",
};

export function MemberRoleSelector({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const [role, setRole] = useState<Role>(currentRole);
  const [isPending, startTransition] = useTransition();

  function onChange(next: string | null) {
    if (!next) return;
    const nextRole = next as Role;
    setRole(nextRole);
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, nextRole);
      if (!res.ok) {
        toast.error(res.error);
        setRole(currentRole);
      } else {
        toast.success(`Role updated to ${LABELS[nextRole]}`);
      }
    });
  }

  return (
    <Select value={role} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger className="min-w-[170px]">
        <SelectValue>{LABELS[role]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(["MEMBER", "COACH", "WELFARE_OFFICER", "COMMITTEE", "ADMIN"] as const).map((r) => (
          <SelectItem key={r} value={r}>
            {LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
