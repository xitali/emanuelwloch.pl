import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const projectId = "5187fe58-43e9-46a8-aba5-7016acfbc55a";
  const images = JSON.stringify(["/projects/5187fe58-43e9-46a8-aba5-7016acfbc55a_0.png"]);

  await db.execute({
    sql: "UPDATE projects SET images = ? WHERE id = ?",
    args: [images, projectId],
  });

  console.log("Successfully updated project image in Turso DB for Portfolio project!");
}

main().catch(console.error);
