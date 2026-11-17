export const contactSources = ["", "Polecenie", "Google", "Instagram / Facebook", "LinkedIn", "Strona wykonana przez Emanuela", "Inne"] as const;

export function messageWithSource(message: string, source: string) {
  return source ? `${message}\n\nŹródło kontaktu (wskazane w formularzu): ${source}` : message;
}
