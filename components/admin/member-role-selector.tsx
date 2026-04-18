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

type Role = "USER" | "WELFARE_OFFICER" | "ADMIN";

const LABELS: Record<Role, string> = {
  USER: "User",
  WELFARE_OFFICER: "Welfare officer",
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
        {(["USER", "WELFARE_OFFICER", "ADMIN"] as const).map((r) => (
          <SelectItem key={r} value={r}>
            {LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
