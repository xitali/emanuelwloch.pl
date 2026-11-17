import "server-only";

export function getClientIp(headersList: Headers): string {
  const forwarded =
    headersList.get("x-vercel-forwarded-for") ??
    headersList.get("x-forwarded-for") ??
    headersList.get("x-real-ip");

  return forwarded?.split(",")[0]?.trim() || "unknown";
}
