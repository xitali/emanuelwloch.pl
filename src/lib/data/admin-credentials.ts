/** Admin password check and credential versions used to revoke sessions. */
import "server-only";
import { turso } from "@/lib/server/turso";
import bcrypt from "bcryptjs";

export interface AdminCredential { id: string; credentialVersion: number }

export async function authenticateAdmin(password: string): Promise<AdminCredential | null> {
  try {
    const result = await turso.execute("SELECT id, password_hash, credential_version FROM admin_users ORDER BY created_at, id");
    for (const row of result.rows) {
      if (await bcrypt.compare(password, String(row.password_hash))) {
        return { id: String(row.id), credentialVersion: Number(row.credential_version) };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function isAdminCredentialCurrent(id: string, version: number): Promise<boolean> {
  const result = await turso.execute({ sql: "SELECT credential_version FROM admin_users WHERE id = ?", args: [id] });
  return result.rows.length === 1 && Number(result.rows[0].credential_version) === version;
}
