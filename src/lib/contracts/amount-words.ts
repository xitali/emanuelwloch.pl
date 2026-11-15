/** Polish amount in words for contracts: "dwa tysiące trzysta złotych 50/100". */
const UNITS = ["", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"];
const TEENS = ["dziesięć", "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście", "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście"];
const TENS = ["", "", "dwadzieścia", "trzydzieści", "czterdzieści", "pięćdziesiąt", "sześćdziesiąt", "siedemdziesiąt", "osiemdziesiąt", "dziewięćdziesiąt"];
const HUNDREDS = ["", "sto", "dwieście", "trzysta", "czterysta", "pięćset", "sześćset", "siedemset", "osiemset", "dziewięćset"];

/** Polish plural form for a count: one / few (2–4, not 12–14) / many. */
export function pluralPl(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const lastTwo = n % 100, last = n % 10;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}

function below1000(n: number) {
  const words = [HUNDREDS[Math.floor(n / 100)]];
  const rest = n % 100;
  if (rest >= 10 && rest < 20) words.push(TEENS[rest - 10]);
  else words.push(TENS[Math.floor(rest / 10)], UNITS[rest % 10]);
  return words.filter(Boolean).join(" ");
}

export function numberInWords(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000), thousands = Math.floor((n % 1_000_000) / 1000), rest = n % 1000;
  if (millions) parts.push(`${below1000(millions)} ${pluralPl(millions, "milion", "miliony", "milionów")}`);
  if (thousands) parts.push(`${below1000(thousands)} ${pluralPl(thousands, "tysiąc", "tysiące", "tysięcy")}`);
  if (rest) parts.push(below1000(rest));
  return parts.join(" ");
}

export function amountInWords(amount: number) {
  const cents = Math.round(amount * 100);
  const zl = Math.floor(cents / 100), gr = cents % 100;
  return `${numberInWords(zl)} ${pluralPl(zl, "złoty", "złote", "złotych")} ${String(gr).padStart(2, "0")}/100`;
}

/** "3 000,00 zł" */
export const formatPln = (amount: number) => `${amount.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
