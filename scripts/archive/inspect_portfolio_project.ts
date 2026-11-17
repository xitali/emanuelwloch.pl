import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const result = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ?",
    args: ["5187fe58-43e9-46a8-aba5-7016acfbc55a"],
  });
  console.log("Current Portfolio project details:");
  console.log(JSON.stringify(result.rows[0], null, 2));
}

main().catch(console.error);
