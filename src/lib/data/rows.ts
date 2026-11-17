/** Helpers for reading Turso rows. */

/** Safely parses a JSON array stored in a text column (tolerates legacy double-encoded items). */
export function safeParseJsonArray(jsonStr: unknown): string[] {
  if (!jsonStr || typeof jsonStr !== 'string') return [];
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed.flatMap(item => {
        if (typeof item === 'string' && item.startsWith('[')) {
          try {
            const inner = JSON.parse(item);
            return Array.isArray(inner) ? inner : [item];
          } catch {
            return item;
          }
        }
        return item;
      });
    }
    return [];
  } catch {
    return [];
  }
}
