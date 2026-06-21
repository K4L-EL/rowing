import { vi } from "vitest";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function mockAuthReturn(user: MockUser | null) {
  // Mock the auth() function from next-auth
  vi.mock("@/auth", () => ({
    auth: vi.fn().mockResolvedValue(
      user
        ? { user: { id: user.id, name: user.name, email: user.email, role: user.role } }
        : null,
    ),
  }));
}
