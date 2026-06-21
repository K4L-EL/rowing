import { describe, it, expect } from "vitest";
import { hasPermission, getPermissions, serverHasPermission } from "@/lib/permissions";
import type { AppRole } from "@/types/next-auth";

describe("hasPermission", () => {
  it("MEMBER has view:own-welfare", () => {
    expect(hasPermission("MEMBER", "view:own-welfare")).toBe(true);
  });

  it("MEMBER does not have build:crews", () => {
    expect(hasPermission("MEMBER", "build:crews")).toBe(false);
  });

  it("MEMBER does not have view:all-welfare", () => {
    expect(hasPermission("MEMBER", "view:all-welfare")).toBe(false);
  });

  it("COACH has build:crews", () => {
    expect(hasPermission("COACH", "build:crews")).toBe(true);
  });

  it("COACH has view:all-welfare", () => {
    expect(hasPermission("COACH", "view:all-welfare")).toBe(true);
  });

  it("COACH does not have manage:system", () => {
    expect(hasPermission("COACH", "manage:system")).toBe(false);
  });

  it("WELFARE_OFFICER has view:all-welfare", () => {
    expect(hasPermission("WELFARE_OFFICER", "view:all-welfare")).toBe(true);
  });

  it("WELFARE_OFFICER has manage:welfare", () => {
    expect(hasPermission("WELFARE_OFFICER", "manage:welfare")).toBe(true);
  });

  it("WELFARE_OFFICER does not have build:crews", () => {
    expect(hasPermission("WELFARE_OFFICER", "build:crews")).toBe(false);
  });

  it("COMMITTEE has view:accounting", () => {
    expect(hasPermission("COMMITTEE", "view:accounting")).toBe(true);
  });

  it("COMMITTEE has view:members", () => {
    expect(hasPermission("COMMITTEE", "view:members")).toBe(true);
  });

  it("COMMITTEE does not have manage:welfare", () => {
    expect(hasPermission("COMMITTEE", "manage:welfare")).toBe(false);
  });

  it("ADMIN has all 9 permissions", () => {
    const all: string[] = [
      "view:own-welfare",
      "view:all-welfare",
      "manage:welfare",
      "build:crews",
      "view:availability",
      "view:accounting",
      "view:members",
      "manage:roles",
      "manage:system",
    ];
    all.forEach((p) => {
      expect(hasPermission("ADMIN", p as any)).toBe(true);
    });
  });

  it("ADMIN has manage:system", () => {
    expect(hasPermission("ADMIN", "manage:system")).toBe(true);
  });

  it("unknown role returns false", () => {
    expect(hasPermission("UNKNOWN" as AppRole, "view:own-welfare")).toBe(false);
  });
});

describe("getPermissions", () => {
  it("returns correct permissions for MEMBER", () => {
    expect(getPermissions("MEMBER")).toEqual(["view:own-welfare", "view:availability"]);
  });

  it("returns all 9 permissions for ADMIN", () => {
    expect(getPermissions("ADMIN")).toHaveLength(9);
  });

  it("returns empty array for unknown role", () => {
    expect(getPermissions("UNKNOWN" as AppRole)).toEqual([]);
  });
});

describe("serverHasPermission", () => {
  it("returns same results as hasPermission", () => {
    expect(serverHasPermission("MEMBER", "view:own-welfare")).toBe(true);
    expect(serverHasPermission("MEMBER", "build:crews")).toBe(false);
    expect(serverHasPermission("ADMIN", "manage:system")).toBe(true);
    expect(serverHasPermission("COMMITTEE", "view:accounting")).toBe(true);
    expect(serverHasPermission("COMMITTEE", "manage:system")).toBe(false);
  });

  it("returns false for unknown role", () => {
    expect(serverHasPermission("UNKNOWN" as AppRole, "view:own-welfare")).toBe(false);
  });
});
