import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const result = await db.execute("SELECT id, title, images FROM projects");
  console.log("Current projects in Turso DB:");
  console.log(JSON.stringify(result.rows, null, 2));
}

main().catch(console.error);
