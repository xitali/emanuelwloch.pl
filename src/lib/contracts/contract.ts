/*
 * Contract template for a person working without a registered company.
 *  - "dzielo": umowa o dzieło (client is usually a company; it withholds PIT and reports RUD),
 *  - "nierejestrowana": umowa o dzieło performed within unregistered activity (receipt, own tax).
 * Consumer clauses (14-day withdrawal, no liability cap) are added when consumerRights is set:
 * a private person, or a sole trader for whom the order is not professional in nature.
 * A template, not legal advice.
 */
import { amountInWords, formatPln } from "./amount-words";
import { LEGAL_2026 } from "./legal-2026";

export type ContractMode = "dzielo" | "nierejestrowana";

export interface ContractInput {
  mode: ContractMode;
  contractor: { name: string; address: string; pesel?: string; email: string; phone?: string; bank: string };
  client: { kind: "firma" | "osoba"; name: string; address: string; nip?: string; representative?: string; email: string };
  /** Client has consumer rights (private person, or sole trader buying outside their profession). */
  consumerRights: boolean;
  /** Concluded at a distance (e-mail, online) rather than in person. */
  remote: boolean;
  work: { title: string; description: string };
  dates: { signed: string; start: string; deadline: string };
  price: { amount: number; advancePercent: number; paymentDays: number; copyrightShare: number };
  revisions: number;
  supportDays: number;
  place: string;
}

export interface ContractSection { heading: string; items: string[] }
export interface ContractAnnex extends ContractSection { title: string }
export interface Contract { title: string; preamble: string[]; sections: ContractSection[]; annexes: ContractAnnex[]; signatures: [string, string] }

const date = (iso: string) => iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }) : "…………";
const or = (value: string | undefined, blank = "…………………………") => value?.trim() || blank;

export function buildContract(input: ContractInput): Contract {
  const { contractor: w, client: z, price } = input;
  const consumer = input.consumerRights;
  const firmClient = z.kind === "firma";
  const unregistered = input.mode === "nierejestrowana";
  const advance = Math.round(price.amount * price.advancePercent) / 100;
  const amount = `${formatPln(price.amount)} (słownie: ${amountInWords(price.amount)})`;

  const sections: ContractSection[] = [];
  sections.push({ heading: "§ 1. Przedmiot umowy", items: [
    `Wykonawca zobowiązuje się wykonać dzieło: ${or(input.work.title)} (dalej: „Dzieło”), a Zamawiający zobowiązuje się Dzieło odebrać i zapłacić wynagrodzenie.`,
    `Zakres Dzieła: ${or(input.work.description)}`,
    "Zmiany zakresu wykraczające poza opis z ust. 2 wymagają uzgodnienia w formie dokumentowej (np. e-mail), w tym wpływu na termin i wynagrodzenie.",
    ...(unregistered ? ["Wykonawca wykonuje umowę jako osoba fizyczna w ramach działalności nierejestrowanej (art. 5 ust. 1 ustawy z dnia 6 marca 2018 r. — Prawo przedsiębiorców)."] : []),
  ] });
  sections.push({ heading: "§ 2. Termin", items: [
    `Wykonawca rozpocznie prace ${date(input.dates.start)} i udostępni Dzieło do odbioru do dnia ${date(input.dates.deadline)}.`,
    "Termin ulega przesunięciu o czas opóźnienia Zamawiającego w dostarczeniu materiałów, dostępów lub decyzji potrzebnych do wykonania Dzieła.",
  ] });
  sections.push({ heading: "§ 3. Współpraca", items: [
    "Zamawiający dostarczy treści, zdjęcia, logotypy i dostępy (np. do domeny i hostingu) potrzebne do wykonania Dzieła i oświadcza, że ma prawo z nich korzystać w tym celu.",
    "Wykonawca może korzystać z bibliotek i narzędzi open source oraz usług zewnętrznych, o ile ich licencje pozwalają na użycie w Dziele. Ich lista zostanie wskazana w protokole odbioru.",
    "Strony kontaktują się za pomocą adresów e-mail wskazanych w komparycji umowy.",
  ] });
  sections.push({ heading: "§ 4. Odbiór", items: [
    "Wykonawca udostępni Dzieło do sprawdzenia (np. wersję testową pod adresem internetowym) i powiadomi o tym Zamawiającego.",
    "W ciągu 7 dni Zamawiający zgłosi uwagi albo podpisze protokół odbioru. Wzór protokołu stanowi Załącznik nr 1.",
    `W ramach wynagrodzenia Wykonawca uwzględni ${input.revisions} ${input.revisions === 1 ? "rundę" : "rundy"} poprawek zgodnych z zakresem z § 1. Kolejne zmiany wycenia osobno.`,
    ...(consumer ? [] : ["Brak uwag w terminie z ust. 2 oznacza odbiór Dzieła bez zastrzeżeń."]),
  ] });

  const pay: string[] = [
    `Za wykonanie Dzieła Zamawiający zapłaci wynagrodzenie w kwocie ${amount}${unregistered ? "" : " brutto"}.`,
  ];
  if (price.advancePercent > 0) pay.push(`Zaliczka w wysokości ${price.advancePercent}% wynagrodzenia, tj. ${formatPln(advance)}, płatna w ciągu 7 dni od zawarcia umowy. Pozostała część płatna w ciągu ${price.paymentDays} dni od odbioru Dzieła.`);
  else pay.push(`Wynagrodzenie płatne w ciągu ${price.paymentDays} dni od odbioru Dzieła.`);
  pay.push(`Płatność na rachunek bankowy Wykonawcy nr ${or(w.bank)}.`);
  if (unregistered) {
    pay.push("Podstawą zapłaty jest rachunek wystawiony przez Wykonawcę. Wykonawca samodzielnie rozlicza podatek dochodowy od tego przychodu.");
    pay.push("Wykonawca korzysta ze zwolnienia podmiotowego z VAT (art. 113 ustawy o podatku od towarów i usług). Kwota wynagrodzenia jest kwotą ostateczną.");
  } else {
    pay.push(`Wynagrodzenie obejmuje honorarium za przeniesienie autorskich praw majątkowych, o którym mowa w § 6, w wysokości ${price.copyrightShare}% kwoty wynagrodzenia.`);
    if (firmClient) pay.push(`Zamawiający, jako płatnik, pobierze i odprowadzi zaliczkę na podatek dochodowy (art. 41 ustawy o podatku dochodowym od osób fizycznych) i przekaże Wykonawcy informację PIT-11. Zamawiający zgłosi umowę do ZUS na formularzu RUD w ciągu ${LEGAL_2026.rudDays} dni od jej zawarcia.`);
    else pay.push(`Zamawiający nie jest płatnikiem podatku; Wykonawca rozlicza podatek samodzielnie. Zamawiający zgłosi umowę do ZUS na formularzu RUD w ciągu ${LEGAL_2026.rudDays} dni od jej zawarcia, jeżeli obowiązek ten go dotyczy.`);
  }
  sections.push({ heading: "§ 5. Wynagrodzenie", items: pay });

  sections.push({ heading: "§ 6. Prawa autorskie", items: [
    "Z chwilą zapłaty całości wynagrodzenia Wykonawca przenosi na Zamawiającego autorskie prawa majątkowe do Dzieła, w tym do kodu źródłowego i projektu graficznego, bez ograniczeń czasowych i terytorialnych, na polach eksploatacji: (a) utrwalanie i zwielokrotnianie dowolną techniką, w tym wprowadzanie do pamięci komputera i sieci; (b) publiczne udostępnianie w taki sposób, aby każdy mógł mieć do Dzieła dostęp w miejscu i czasie przez siebie wybranym, w szczególności w Internecie; (c) tłumaczenie, przystosowywanie, zmiana układu i wszelkie inne zmiany (art. 74 ust. 4 ustawy o prawie autorskim i prawach pokrewnych); (d) rozpowszechnianie, w tym użyczenie i najem egzemplarzy.",
    "Wraz z prawami autorskimi Wykonawca przenosi własność egzemplarzy Dzieła (plików i kodu źródłowego) oraz zezwala na wykonywanie zależnych praw autorskich.",
    "Do czasu zapłaty całości wynagrodzenia Zamawiający może korzystać z Dzieła wyłącznie w celu jego sprawdzenia.",
    "Przeniesienie nie obejmuje bibliotek, czcionek, zdjęć i usług zewnętrznych, o których mowa w § 3 ust. 2. Zamawiający korzysta z nich na zasadach ich licencji.",
    "Wykonawca może pokazywać Dzieło w swoim portfolio, chyba że Zamawiający zastrzeże inaczej w formie dokumentowej.",
  ] });

  sections.push({ heading: "§ 7. Poprawki po odbiorze i odpowiedzialność", items: [
    `Błędy Dzieła zgłoszone w ciągu ${input.supportDays} dni od odbioru Wykonawca usunie bez dodatkowego wynagrodzenia, w rozsądnym terminie uzgodnionym z Zamawiającym.`,
    ...(consumer
      ? ["Umowa nie ogranicza praw Zamawiającego wynikających z przepisów o ochronie konsumentów, w tym z tytułu niezgodności Dzieła z umową."]
      : ["Odpowiedzialność Wykonawcy z tytułu umowy ogranicza się do wysokości wynagrodzenia i nie obejmuje utraconych korzyści, z wyjątkiem szkody wyrządzonej umyślnie.", "Strony wyłączają odpowiedzialność Wykonawcy z tytułu rękojmi po upływie terminu z ust. 1."]),
  ] });

  sections.push({ heading: "§ 8. Koszty zewnętrzne", items: [
    "Opłaty za domenę, hosting, płatne usługi i licencje zewnętrzne ponosi Zamawiający. Usługi te rejestrowane są na Zamawiającego.",
  ] });

  sections.push({ heading: "§ 9. Poufność i dane osobowe", items: [
    "Strony zachowają w poufności informacje o drugiej stronie uzyskane w związku z umową, z wyjątkiem informacji publicznie dostępnych.",
    "Jeżeli przy wykonaniu Dzieła Wykonawca uzyska dostęp do danych osobowych przetwarzanych przez Zamawiającego, strony przed udzieleniem dostępu zawrą umowę powierzenia przetwarzania danych (art. 28 RODO).",
  ] });

  const end: string[] = [];
  if (consumer && input.remote) {
    end.push(`Zamawiający może odstąpić od umowy bez podania przyczyny w terminie ${LEGAL_2026.consumerWithdrawalDays} dni od dnia zawarcia umowy, składając oświadczenie, np. na formularzu stanowiącym Załącznik nr 2 (art. 27 ustawy z dnia 30 maja 2014 r. o prawach konsumenta).`);
    end.push("Jeżeli Zamawiający wyraźnie zażąda rozpoczęcia prac przed upływem terminu do odstąpienia, a następnie odstąpi od umowy, zapłaci za świadczenia spełnione do chwili odstąpienia (art. 35 ustawy o prawach konsumenta).");
  }
  end.push("Zamawiający może odstąpić od umowy przed ukończeniem Dzieła, płacąc umówione wynagrodzenie pomniejszone o to, co Wykonawca oszczędził z powodu niewykonania Dzieła (art. 644 Kodeksu cywilnego).");
  end.push("Zmiany umowy wymagają formy dokumentowej (np. e-mail) pod rygorem nieważności, a zmiany dotyczące przeniesienia praw autorskich — formy pisemnej (art. 53 ustawy o prawie autorskim i prawach pokrewnych).");
  end.push(consumer ? "Spory rozstrzyga sąd właściwy według przepisów ogólnych." : "Spory rozstrzyga sąd właściwy dla miejsca zamieszkania Wykonawcy.");
  end.push("W sprawach nieuregulowanych stosuje się przepisy Kodeksu cywilnego. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.");
  sections.push({ heading: "§ 10. Postanowienia końcowe", items: end });

  const annexes: ContractAnnex[] = [{ heading: "Załącznik nr 1", title: "Protokół odbioru", items: [
    `Strony stwierdzają, że w dniu …………………… Wykonawca przekazał, a Zamawiający odebrał Dzieło: ${or(input.work.title)}.`,
    "Dzieło odebrano: ☐ bez zastrzeżeń   ☐ z uwagami: ………………………………………………………………………………",
    "Przekazano: ☐ kod źródłowy   ☐ dostępy   ☐ instrukcję obsługi   ☐ listę licencji zewnętrznych (§ 3 ust. 2)",
    "Podpis Wykonawcy: ……………………………          Podpis Zamawiającego: ……………………………",
  ] }];
  if (consumer && input.remote) annexes.push({ heading: "Załącznik nr 2", title: "Wzór formularza odstąpienia od umowy", items: [
    "(formularz należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy)",
    `Adresat: ${or(w.name)}, ${or(w.address)}, e-mail: ${or(w.email)}`,
    `Ja/My (*) niniejszym informuję/informujemy (*) o moim/naszym odstąpieniu od umowy o wykonanie dzieła: ${or(input.work.title)}.`,
    "Data zawarcia umowy: ……………………   Imię i nazwisko konsumenta(-ów): ……………………………………",
    "Adres konsumenta(-ów): ……………………………………………………   Podpis (tylko jeżeli formularz jest przesyłany w wersji papierowej): ……………………",
    "Data: ……………………   (*) Niepotrzebne skreślić.",
  ] });

  const clientLine = firmClient
    ? `${or(z.name)}, ${or(z.address)}${z.nip ? `, NIP ${z.nip}` : ""}, reprezentowaną przez ${or(z.representative)}, e-mail: ${or(z.email)} — zwaną dalej „Zamawiającym”`
    : `${or(z.name)}, zam. ${or(z.address)}, e-mail: ${or(z.email)} — zwanym/-ną dalej „Zamawiającym”`;

  return {
    title: unregistered ? "Umowa o dzieło (działalność nierejestrowana)" : "Umowa o dzieło z przeniesieniem autorskich praw majątkowych",
    preamble: [
      `zawarta ${input.remote ? "na odległość (bez jednoczesnej obecności stron)" : `w miejscowości ${or(input.place, "…………")}`} w dniu ${date(input.dates.signed)} pomiędzy:`,
      `${or(w.name)}, zam. ${or(w.address)}${w.pesel ? `, PESEL ${w.pesel}` : ""}, e-mail: ${or(w.email)}${w.phone ? `, tel. ${w.phone}` : ""} — zwanym dalej „Wykonawcą”,`,
      `a ${clientLine}.`,
    ],
    sections,
    annexes,
    signatures: ["Wykonawca", "Zamawiający"],
  };
}
