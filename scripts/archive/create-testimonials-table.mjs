import { createClient } from "@libsql/client";
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

turso.execute(`
  CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

await turso.close();
console.log("Tabela testimonials jest gotowa.");
