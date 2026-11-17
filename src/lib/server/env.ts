import "server-only";

export function requireServerEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Brak wymaganej zmiennej środowiskowej: ${name}`);
  }

  return value;
}

export function getJwtSecret(): Uint8Array {
  const secret = requireServerEnv("JWT_SECRET");

  if (secret.length < 32) {
    throw new Error("JWT_SECRET musi mieć co najmniej 32 znaki.");
  }

  return new TextEncoder().encode(secret);
}
