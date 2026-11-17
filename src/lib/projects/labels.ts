const labels: Record<string, string> = {
  "landing-page": "Strona ofertowa",
  "web-app": "Aplikacja internetowa",
  web: "Strona internetowa",
  "e-commerce": "Sklep internetowy",
  mobile: "Aplikacja mobilna",
  "mobile-app": "Aplikacja mobilna",
  "tv-app": "Aplikacja TV",
  "desktop-app": "Aplikacja Windows",
  apps: "Aplikacje TV i Windows",
  "in-development": "W trakcie realizacji",
  completed: "Ukończony",
  published: "Opublikowany",
};

export function projectLabel(value: string | undefined | null, fallback = "Realizacja") {
  return value ? labels[value.toLowerCase()] || value : fallback;
}
