import "server-only";
import { createClient } from "@libsql/client";
import { createHash } from "node:crypto";
import { requireServerEnv } from "@/lib/server/env";

/** The Turso client. Queries live in `@/lib/data/*`, one module per domain. */
export const turso = createClient({
  url: requireServerEnv("TURSO_DATABASE_URL"),
  authToken: requireServerEnv("TURSO_AUTH_TOKEN"),
});

// A local demo and the live catalogue must never reuse each other's cached data.
export const projectDatabaseKey = createHash("sha256").update(requireServerEnv("TURSO_DATABASE_URL")).digest("hex").slice(0, 16);
