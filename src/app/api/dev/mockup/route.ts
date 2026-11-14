import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import sharp from "sharp";

/** Development-only: saves a rendered mockup PNG as WebP under public/mockups. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") return new NextResponse(null, { status: 404 });
  const { out, data } = (await request.json()) as { out?: string; data?: string };
  if (!out || !/^[a-z0-9-]+\.webp$/.test(out) || !data?.startsWith("data:image/png;base64,")) return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  const target = normalize(join(process.cwd(), "public", "mockups", out));
  if (!target.startsWith(normalize(join(process.cwd(), "public", "mockups")))) return NextResponse.json({ error: "Nieprawidłowa ścieżka" }, { status: 400 });
  const png = Buffer.from(data.slice("data:image/png;base64,".length), "base64");
  await mkdir(dirname(target), { recursive: true });
  const image = sharp(png).trim({ threshold: 0 });
  await writeFile(target, await image.webp({ quality: 88, alphaQuality: 90, effort: 6 }).toBuffer());
  // Record project stills so cards and pages can use them; hero and service stills are referenced directly.
  if (!out.startsWith("hero-") && !out.startsWith("usluga-")) {
    const manifestPath = join(process.cwd(), "src", "lib", "mockup-manifest.json");
    const list = new Set<string>(JSON.parse(await readFile(manifestPath, "utf8").catch(() => "[]")));
    list.add(out);
    await writeFile(manifestPath, JSON.stringify([...list].sort(), null, 2) + "\n");
  }
  return NextResponse.json({ saved: `/mockups/${out}` });
}
