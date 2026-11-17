import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

if (!process.argv.includes("--apply")) throw new Error("Uruchom z --apply, aby zapisać szkic.");
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
try {
  const exists = await db.execute({ sql: "SELECT id FROM projects WHERE slug = ? OR project_url = ?", args: ["solid-print", "https://solidprint.emanuelwloch.pl/"] });
  if (exists.rows.length) console.log("Solid Print already exists — no content overwritten.");
  else {
    const now = new Date().toISOString();
    const data = {
      id: randomUUID(), slug: "solid-print", is_published: 0, sort_order: 0,
      title: "Solid Print — platforma pracowni druku 3D",
      short_description: "Strona i panel pracowni druku 3D z katalogiem projektów oraz formularzem wyceny. Wersja testowa.",
      detailed_description: "Platforma dla pracowni zajmującej się projektowaniem i drukiem 3D. Łączy prezentację oferty, katalog gotowych projektów oraz zapytania o indywidualne wykonanie. Panel pozwala zarządzać ofertą i obsługiwać zapytania. Stan na 2 listopada 2026: wersja testowa, przed uruchomieniem sprzedaży i przyjmowaniem rzeczywistych zleceń.",
      category: "web", project_type: "web-app", project_status: "in-development", featured: 0,
      project_url: "https://solidprint.emanuelwloch.pl/", images: "[]", image_alts: "[]",
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Cloudflare Workers", "D1", "R2"]),
      main_challenge: "Połączenie oferty pracowni, katalogu projektów i wyceny indywidualnych modeli w responsywnym serwisie z czytelnym kontaktem.",
      innovation: "Osobne ścieżki dla gotowego projektu i indywidualnej wyceny. Pliki modeli pozostają prywatne i są sprawdzane przed udostępnieniem. Panel obsługuje katalog, zgłoszenia oraz stan usług.",
      project_result: "Działająca wersja testowa strony i panelu. Przed przyjmowaniem rzeczywistych zleceń trzeba uzupełnić dane i dokumenty właściciela, ofertę, fotografie oraz skonfigurować wysyłkę poczty. Brak danych o efektach sprzedażowych.",
      key_features: JSON.stringify(["Katalog gotowych projektów", "Zapytania o wycenę indywidualną", "Prywatne przesyłanie modeli 3D i kontrola plików", "Panel zarządzania ofertą i zgłoszeniami", "Responsywny interfejs z obsługą ograniczonego ruchu"]),
      target_audience: "Osoby i firmy zainteresowane projektowaniem oraz drukiem 3D",
      hosting_platform: "Cloudflare Workers, D1 i R2", created_at: now, updated_at: now,
    };
    await db.execute({ sql: `INSERT INTO projects (${Object.keys(data).join(",")}) VALUES (${Object.keys(data).map(() => "?").join(",")})`, args: Object.values(data) });
    console.log("Solid Print draft created. It is not public.");
  }
} finally { db.close(); }
