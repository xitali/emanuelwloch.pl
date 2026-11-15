/*
 * Email templates in the site's look: graphite and paper, copper for the one action, steel
 * blue for links. Table layout and inline styles so they survive Gmail, Outlook and Apple Mail.
 * Pure functions with no imports: used by the app and by scripts/resend-setup.mjs.
 */

export const SITE_URL = "https://emanuelwloch.pl";

const C = { page: "#ece6da", card: "#fbf8f2", ink: "#171b1e", muted: "#545c61", line: "#ddd5c6", copper: "#c96f3f", copperInk: "#1d0f07", steel: "#2a5b78", graphite: "#0c0d0e" };
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

/** Escapes text from the contact form before it goes into HTML. */
export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Values passed to Resend template variables: no markup characters, short, one line. */
export function templateValue(value: string, max = 120) {
  return value.replace(/[<>&"'`{}\\]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

const paragraph = (html: string) => `<p style="margin:0 0 16px;font:16px/1.65 ${FONT};color:${C.ink}">${html}</p>`;
const button = (label: string, href: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="border-radius:8px;background:${C.copper}"><a href="${href}" style="display:inline-block;padding:14px 22px;font:600 15px/1 ${FONT};color:${C.copperInk};text-decoration:none;border-radius:8px">${label} &rarr;</a></td></tr></table>`;

/** The shared frame: a wordmark bar, a paper card, a quiet footer. */
export function layout({ preheader, title, body }: { preheader: string; title: string; body: string }) {
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 4px 18px"><a href="${SITE_URL}" style="text-decoration:none;font:600 20px/1 ${FONT};color:${C.graphite};letter-spacing:-0.04em">ew <span style="font-weight:400;color:${C.muted};letter-spacing:0">/ Emanuel Włoch</span></a></td></tr>
<tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:14px;padding:36px 36px 20px">
<h1 style="margin:0 0 20px;font:italic 400 30px/1.15 ${SERIF};color:${C.ink}">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 4px 0;font:13px/1.6 ${FONT};color:${C.muted}">Emanuel Włoch · strony, sklepy, aplikacje i programy dla firm · Jarosław i cała Polska<br><a href="${SITE_URL}" style="color:${C.steel}">emanuelwloch.pl</a></td></tr>
</table></td></tr></table></body></html>`;
}

export interface Lead { id: string; name: string; email: string; subject: string; message: string }

/** To the owner: a new enquiry, readable at a glance, answerable with Reply. */
export function leadOwnerEmail(lead: Lead) {
  const name = escapeHtml(lead.name), email = escapeHtml(lead.email), subject = escapeHtml(lead.subject);
  const message = escapeHtml(lead.message).replace(/\r?\n/g, "<br>");
  const adminUrl = `${SITE_URL}/admin?tab=messages&message=${encodeURIComponent(lead.id)}`;
  const html = layout({
    preheader: `${lead.name}: ${lead.subject}`.slice(0, 120).replace(/[<>&]/g, ""),
    title: "Nowe zapytanie ze strony",
    body: `${paragraph(`<strong>${name}</strong> &middot; <a href="mailto:${email}" style="color:${C.steel}">${email}</a>`)}
${paragraph(`<span style="color:${C.muted}">Temat:</span> ${subject}`)}
<div style="margin:0 0 24px;padding:18px 20px;border-left:3px solid ${C.copper};background:#fff;font:15px/1.65 ${FONT};color:${C.ink}">${message}</div>
${paragraph("Odpowiedz na tego maila, a wiadomość trafi prosto do klienta.")}
${button("Otwórz w panelu", adminUrl)}`,
  });
  const text = `Nowe zapytanie ze strony\n\n${lead.name} <${lead.email}>\nTemat: ${lead.subject}\n\n${lead.message}\n\nOdpowiedz na tego maila, a wiadomość trafi prosto do klienta.\nPanel: ${adminUrl}`;
  return { subject: `Nowe zapytanie: ${lead.subject.replace(/[\r\n]/g, " ")}`, html, text };
}

/** To the client: confirmation, what happens next, a copy of what they sent. */
export function leadSenderEmail(lead: Lead) {
  // No name in the greeting: Polish needs the vocative ("Anno"), which can't be derived safely.
  const message = escapeHtml(lead.message).replace(/\r?\n/g, "<br>");
  const html = layout({
    preheader: "Dostałem Twoją wiadomość. Odpowiem na ten adres.",
    title: "Dziękuję za wiadomość.",
    body: `${paragraph("Dostałem Twoją wiadomość i przeczytam ją osobiście. Odpowiem na ten adres. Jeśli w międzyczasie przypomni Ci się coś ważnego, po prostu odpowiedz na tego maila.")}
${paragraph(`<strong>Co dalej?</strong> Najpierw krótka rozmowa o tym, czego potrzebujesz. Potem dostaniesz propozycję zakresu, cenę i termin. Decyzję podejmujesz dopiero wtedy.`)}
${button("Zobacz realizacje", `${SITE_URL}/realizacje`)}
<p style="margin:0 0 8px;font:13px/1.5 ${FONT};color:${C.muted}">Twoja wiadomość:</p>
<div style="margin:0 0 20px;padding:16px 18px;background:#fff;border:1px solid ${C.line};border-radius:8px;font:14px/1.6 ${FONT};color:${C.muted}">${message}</div>`,
  });
  const text = `Dziękuję za wiadomość.\n\nDostałem Twoją wiadomość i przeczytam ją osobiście. Odpowiem na ten adres. Jeśli przypomni Ci się coś ważnego, odpowiedz na tego maila.\n\nCo dalej? Najpierw krótka rozmowa o tym, czego potrzebujesz. Potem dostaniesz propozycję zakresu, cenę i termin.\n\nRealizacje: ${SITE_URL}/realizacje\n\nTwoja wiadomość:\n${lead.message}\n\nEmanuel Włoch\n${SITE_URL}`;
  return { subject: "Dziękuję za wiadomość — Emanuel Włoch", html, text };
}

/*
 * Templates stored in Resend and sent by Resend Automations. Variables are filled by Resend
 * from the event payload; the site sends them through templateValue(), so they hold no markup.
 */
export const automationTemplates = [
  {
    alias: "przypomnienie-o-zapytaniu",
    name: "Przypomnienie: zapytanie bez odpowiedzi",
    subject: "Zapytanie czeka na odpowiedź: {{{SUBJECT}}}",
    variables: [{ key: "CLIENT_NAME", type: "string", fallback_value: "Klient" }, { key: "SUBJECT", type: "string", fallback_value: "zapytanie ze strony" }, { key: "ADMIN_URL", type: "string", fallback_value: `${SITE_URL}/admin` }],
    html: layout({
      preheader: "Od 24 godzin bez zmiany statusu.",
      title: "Zapytanie czeka na odpowiedź",
      body: `${paragraph("<strong>{{{CLIENT_NAME}}}</strong> napisał(a) wczoraj w sprawie: {{{SUBJECT}}}.")}
${paragraph("Status w panelu nie zmienił się od 24 godzin. Jeśli już odpowiedziałeś, oznacz zapytanie jako „Odpowiedziano”, a przypomnienia przestaną przychodzić.")}
${button("Otwórz zapytanie", "{{{ADMIN_URL}}}")}`,
    }),
    text: "{{{CLIENT_NAME}}} napisał(a) wczoraj w sprawie: {{{SUBJECT}}}.\n\nStatus w panelu nie zmienił się od 24 godzin. Jeśli już odpowiedziałeś, oznacz zapytanie jako „Odpowiedziano”.\n\n{{{ADMIN_URL}}}",
  },
  {
    alias: "prosba-o-opinie",
    name: "Prośba o opinię po zakończonym projekcie",
    subject: "Jak oceniasz naszą współpracę?",
    variables: [{ key: "CLIENT_NAME", type: "string", fallback_value: "" }],
    html: layout({
      preheader: "Dwa, trzy zdania o współpracy bardzo mi pomogą.",
      title: "Dzień dobry,",
      body: `${paragraph("minął tydzień od zakończenia naszego projektu. Mam nadzieję, że wszystko działa tak, jak chciałeś.")}
${paragraph("Czy możesz w dwóch, trzech zdaniach napisać, jak oceniasz współpracę? Wystarczy odpowiedzieć na tego maila. Za Twoją zgodą opublikuję opinię na stronie, z imieniem i nazwą firmy, bez zmieniania treści.")}
${paragraph("Jeśli coś wymaga poprawki, też napisz. Zajmę się tym.")}
${paragraph("Dziękuję,<br>Emanuel Włoch")}`,
    }),
    text: "Dzień dobry,\n\nminął tydzień od zakończenia naszego projektu. Czy możesz w dwóch, trzech zdaniach napisać, jak oceniasz współpracę? Wystarczy odpowiedzieć na tego maila. Za Twoją zgodą opublikuję opinię na stronie, bez zmieniania treści.\n\nJeśli coś wymaga poprawki, też napisz.\n\nDziękuję,\nEmanuel Włoch\nhttps://emanuelwloch.pl",
  },
] as const;

/** Custom events the site sends to Resend; their payloads become template variables. */
export const RESEND_EVENTS = {
  leadReceived: "lead.received",
  leadAnswered: "lead.answered",
  reviewRequested: "review.requested",
} as const;
