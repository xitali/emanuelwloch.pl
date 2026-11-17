import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";
const mocks = vi.hoisted(() => ({ current: vi.fn(), get: vi.fn(), set: vi.fn(), delete: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: mocks.get, set: mocks.set, delete: mocks.delete }) }));
vi.mock("@/lib/server/turso", () => ({ isAdminCredentialCurrent: mocks.current }));
import { createAdminSession, createMobileAdminToken, verifyAdminSession, verifyMobileAdminToken } from "@/lib/server/auth";
const secret = new TextEncoder().encode("test-secret-at-least-thirty-two-characters-long");
beforeEach(() => { vi.clearAllMocks(); process.env.JWT_SECRET = new TextDecoder().decode(secret); mocks.current.mockResolvedValue(true); });

describe("revocable administrator sessions", () => {
  it("accepts current web credentials and rejects them after reset", async () => {
    await createAdminSession({ id: "owner", credentialVersion: 2 });
    const token = mocks.set.mock.calls[0][1];
    mocks.get.mockReturnValue({ value: token });
    expect(await verifyAdminSession()).toBe(true);
    expect(mocks.current).toHaveBeenCalledWith("owner", 2);
    mocks.current.mockResolvedValue(false);
    expect(await verifyAdminSession()).toBe(false);
  });
  it("revokes Android sessions with the same credential version", async () => {
    const token = await createMobileAdminToken({ id: "owner", credentialVersion: 2 });
    expect(await verifyMobileAdminToken(`Bearer ${token}`)).toBe(true);
    mocks.current.mockResolvedValue(false);
    expect(await verifyMobileAdminToken(`Bearer ${token}`)).toBe(false);
  });
  it("rejects signed legacy tokens and wrong audiences", async () => {
    const legacy = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setSubject("admin").setIssuer("emanuelwloch.pl").setAudience("emanuelwloch.pl/admin").setExpirationTime("1h").sign(secret);
    mocks.get.mockReturnValue({ value: legacy });
    expect(await verifyAdminSession()).toBe(false);
    const mobile = await createMobileAdminToken({ id: "owner", credentialVersion: 0 });
    mocks.get.mockReturnValue({ value: mobile });
    expect(await verifyAdminSession()).toBe(false);
  });
  it("fails closed when the database is unavailable", async () => {
    const token = await createMobileAdminToken({ id: "owner", credentialVersion: 0 });
    mocks.current.mockRejectedValue(new Error("offline"));
    expect(await verifyMobileAdminToken(`Bearer ${token}`)).toBe(false);
  });
});
