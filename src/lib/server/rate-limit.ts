import "server-only";

import { createHash } from "node:crypto";
import { turso } from "@/lib/server/turso";

interface RateLimitOptions {
  namespace: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

export async function checkRateLimit({
  namespace,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = Date.now();
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs).toISOString();
  const salt = process.env.RATE_LIMIT_SALT || process.env.JWT_SECRET;

  if (!salt) {
    throw new Error("Brak RATE_LIMIT_SALT lub JWT_SECRET.");
  }

  const identifierHash = createHash("sha256")
    .update(`${salt}:${identifier}`)
    .digest("hex");
  const bucketKey = `${namespace}:${identifierHash}`;

  const result = await turso.execute({
    sql: `INSERT INTO rate_limits (bucket_key, window_start, request_count)
          VALUES (?, ?, 1)
          ON CONFLICT(bucket_key, window_start)
          DO UPDATE SET request_count = request_count + 1
          RETURNING request_count`,
    args: [bucketKey, windowStart],
  });

  const count = Number(result.rows[0]?.request_count ?? limit + 1);
  const retryAfter = Math.max(
    1,
    Math.ceil((windowStartMs + windowMs - now) / 1000),
  );

  return { allowed: count <= limit, retryAfter };
}
