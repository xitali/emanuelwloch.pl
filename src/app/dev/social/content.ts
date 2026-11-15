/*
 * Marketing pack, November–December 2026: Facebook/Instagram posts and Google Business
 * Profile posts. Each entry carries its caption and the graphic it uses, so the images
 * (/dev/social), the reels (/dev/film?reel=…) and the copy document are built from one source.
 * Facts only from the site and the database: published prices (net), real screens, verbatim
 * testimonial, honest project status. No invented results.
 */

export type Graphic =
  | { kind: "hero" }
  | { kind: "service"; path: number }
  | { kind: "case"; slug: string; title: string; type: string; line: string; status?: string; mockup: string }
  | { kind: "quote" }
  | { kind: "process" }
  | { kind: "about" }
  | { kind: "guide"; title: string; line: string }
  | { kind: "backoffice" };

export interface SocialPost {
  id: string;
  /** Week and day in the four-week plan. */
  slot: string;
  channel: "fb-ig" | "gbp";
  graphic: Graphic;
  /** Reel to publish with the post (rendered from /dev/film?reel=…), when there is one. */
  reel?: string;
  caption: string;
  hashtags?: string[];
  /** Google Business Profile call-to-action button and link. */
  cta?: { button: "Dowiedz się więcej" | "Zadzwoń teraz" | "Zamów"; url: string };
  alt: string;
}

const TAGS = ["#stronyinternetowe", "#jarosław", "#podkarpacie", "#małafirma", "#emanuelwloch"];
const SITE = "https://emanuelwloch.pl";

export const posts: SocialPost[] = [
  // —— Tydzień 1 ——
  {
    id: "fb-01-start", slot: "Tydzień 1 · poniedziałek", channel: "fb-ig", graphic: { kind: "hero" }, reel: "film",
    caption: `Strony, sklepy, aplikacje i programy dla Twojej firmy.

Nie musisz wiedzieć, czy potrzebujesz strony, aplikacji czy programu. Opisz, co chcesz usprawnić, a ja dobiorę rozwiązanie i zbuduję je od projektu po wdrożenie.

Przez cały czas rozmawiasz ze mną, z osobą, która pisze kod.

👉 Zobacz realizacje i napisz kilka zdań: emanuelwloch.pl`,
    hashtags: [...TAGS, "#sklepinternetowy", "#aplikacjewebowe"],
    alt: "Laptop i monitor na biurku z prawdziwymi stronami z realizacji. Napis: Strony, sklepy, aplikacje i programy dla Twojej firmy.",
  },
  {
    id: "fb-02-strona", slot: "Tydzień 1 · środa", channel: "fb-ig", graphic: { kind: "service", path: 0 }, reel: "site",
    caption: `Klienci nie wiedzą, czym się zajmujesz, albo nie mogą Cię znaleźć?

Strona firmowa ma odpowiedzieć na trzy pytania w kilka sekund: co robisz, dla kogo i jak się z Tobą skontaktować. Reszta to dodatki.

Co dostajesz:
✔ ofertę, realizacje i wygodny kontakt na każdym ekranie
✔ wersję dopasowaną do telefonu
✔ podstawy SEO, żeby Google rozumiał, czym się zajmujesz

Strona firmowa: od 600 zł netto. Dokładną wycenę dostaniesz po krótkiej rozmowie.

👉 emanuelwloch.pl/tworzenie-stron-internetowych`,
    hashtags: [...TAGS, "#stronafirmowa"],
    alt: "Laptop i telefon z otwartą stroną firmową. Napis: Strona firmowa, od 600 zł netto.",
  },
  {
    id: "fb-03-vip", slot: "Tydzień 1 · piątek", channel: "fb-ig",
    graphic: { kind: "case", slug: "vip-transfery-platforma-premium-transport-solutions", title: "VIP Transfery", type: "Strona ofertowa", line: "Usługi, samochód i droga do zamówienia przejazdu na jednej stronie.", mockup: "/mockups/vip-transfery-platforma-premium-transport-solutions.webp" },
    caption: `Realizacja: VIP Transfery, strona przewozów premium.

Wyzwanie: jak pokazać standard transportu zdjęciami i jednocześnie pozwolić szybko znaleźć odpowiednią usługę?

Rozwiązanie: duże zdjęcia samochodu, krótkie opisy usług i wyraźna droga do zamówienia przejazdu, także na telefonie.

Pełny opis realizacji 👉 emanuelwloch.pl/realizacje`,
    hashtags: [...TAGS, "#realizacja", "#webdesign"],
    alt: "Strona VIP Transfery na laptopie i monitorze: zdjęcie samochodu premium i lista usług.",
  },
  // —— Tydzień 2 ——
  {
    id: "fb-04-sklep", slot: "Tydzień 2 · poniedziałek", channel: "fb-ig", graphic: { kind: "service", path: 1 }, reel: "shop",
    caption: `Chcesz sprzedawać online i mieć zamówienia pod kontrolą?

Sklep to nie tylko katalog. To także panel, w którym dodajesz produkty, zmieniasz ceny i sprawdzasz zamówienia bez pisania do programisty.

✔ katalog z wyszukiwaniem i filtrami
✔ koszyk i proste zamówienie
✔ panel produktów i zamówień
✔ płatności i dostawę wybieramy razem

Sklep internetowy: od 1800 zł netto.

Ile kosztuje sklep i od czego to zależy? Napisałem o tym poradnik 👉 emanuelwloch.pl/poradniki/ile-kosztuje-sklep-internetowy-2026`,
    hashtags: [...TAGS, "#sklepinternetowy", "#ecommerce"],
    alt: "Laptop ze sklepem internetowym i karty produktów lecące do zamówienia. Napis: Sklep internetowy, od 1800 zł netto.",
  },
  {
    id: "fb-05-opinia", slot: "Tydzień 2 · środa", channel: "fb-ig", graphic: { kind: "quote" },
    caption: `„Projekt jest bardzo świeży, nowoczesny, a zarazem ciepły w odbiorze.”
Joanna Michno, Zielona Baza (restauracja wegańska, Rzeszów)

Dziękuję! Przy tej stronie najważniejsze było pełne menu, wygodne także dla kogoś, kto sprawdza je na telefonie w drodze do restauracji.

Realizacja 👉 emanuelwloch.pl/realizacje`,
    hashtags: [...TAGS, "#rzeszów", "#opinia"],
    alt: "Cytat na jasnym tle: Projekt jest bardzo świeży, nowoczesny, a zarazem ciepły w odbiorze. Joanna Michno, Zielona Baza.",
  },
  {
    id: "fb-06-proces", slot: "Tydzień 2 · piątek", channel: "fb-ig", graphic: { kind: "process" },
    caption: `Jak wygląda współpraca? Cztery kroki, bez niespodzianek.

1️⃣ Rozmowa: opowiadasz, czym się zajmujesz i co chcesz usprawnić.
2️⃣ Zakres i wycena: dostajesz propozycję, cenę i termin. Decydujesz, czy zaczynamy.
3️⃣ Projekt i realizacja: widzisz projekt i wersję testową, mówisz, co dopracować.
4️⃣ Wdrożenie: uruchamiam projekt i pokazuję, jak z niego korzystać.

Wycena jest bezpłatna i do niczego nie zobowiązuje.
👉 emanuelwloch.pl/#kontakt`,
    hashtags: [...TAGS, "#współpraca"],
    alt: "Cztery kroki współpracy: rozmowa, zakres i wycena, projekt i realizacja, wdrożenie.",
  },
  // —— Tydzień 3 ——
  {
    id: "fb-07-baza", slot: "Tydzień 3 · poniedziałek", channel: "fb-ig", graphic: { kind: "service", path: 3 }, reel: "data",
    caption: `Dane w arkuszach, mailach i zeszytach, a szukanie trwa?

Jedna baza i panel zamiast pięciu plików „ostateczna_wersja_2.xlsx”:
✔ klienci, zamówienia, produkty albo zgłoszenia w jednym miejscu
✔ wyszukiwanie w kilka sekund
✔ role: kto widzi, a kto może zmieniać
✔ eksport do arkusza, gdy go potrzebujesz

Przeniosę też Twoje obecne dane. Wycena po rozmowie.

Arkusz czy własna aplikacja? Poradnik 👉 emanuelwloch.pl/poradniki/arkusz-czy-wlasna-aplikacja`,
    hashtags: [...TAGS, "#bazadanych", "#excel"],
    alt: "Wiersze arkusza przenoszone do bazy danych obok laptopa z panelem produktów. Napis: Baza danych i panel.",
  },
  {
    id: "fb-08-zaplecze", slot: "Tydzień 3 · środa", channel: "fb-ig", graphic: { kind: "backoffice" },
    caption: `Za stroną jest zaplecze. Zarządzasz nim sam.

Strona, sklep czy aplikacja to także panel i baza danych. Projektuję je razem z tym, co widzą Twoi klienci:
• panel do codziennej pracy: oferta, ceny, wiadomości
• dostęp według ról
• połączenia z innymi systemami

Możesz kliknąć demo panelu na fikcyjnych danych 👉 emanuelwloch.pl/demo/panel`,
    hashtags: [...TAGS, "#paneladministracyjny"],
    alt: "Rozłożone warstwy aplikacji: panel administratora, role i logowanie, API i integracje, baza danych.",
  },
  {
    id: "fb-09-aplikacja", slot: "Tydzień 3 · piątek", channel: "fb-ig", graphic: { kind: "service", path: 2 }, reel: "app",
    caption: `Rezerwacje, zlecenia albo obsługa klientów zajmują Ci za dużo czasu?

Aplikacja webowa działa w przeglądarce, na komputerze i telefonie, bez instalowania. Z logowaniem i rolami, dopasowana do tego, jak pracuje Twój zespół, a nie odwrotnie.

Aplikacja webowa: od 1200 zł netto.

👉 emanuelwloch.pl/tworzenie-aplikacji-webowych`,
    hashtags: [...TAGS, "#aplikacjewebowe", "#automatyzacja"],
    alt: "Monitor z aplikacją do wyceny i rozsuwające się warstwy: interfejs, logika i API, baza danych. Napis: Aplikacja webowa, od 1200 zł netto.",
  },
  // —— Tydzień 4 ——
  {
    id: "fb-10-program", slot: "Tydzień 4 · poniedziałek", channel: "fb-ig", graphic: { kind: "service", path: 4 }, reel: "program",
    caption: `Potrzebujesz narzędzia na komputer, które działa także bez internetu?

Program na Windows do konkretnego zadania: ewidencja, analiza danych, raporty, eksport. C# i .NET, lokalna baza danych, wykresy.

Przykład: WARDOGS Companion zamienia historię pomiarów w wykresy, bilanse dni i zestawienia postępu.

Program czy aplikacja webowa? Porównanie 👉 emanuelwloch.pl/poradniki/program-na-windows-czy-aplikacja-webowa`,
    hashtags: [...TAGS, "#programnawindows", "#dotnet"],
    alt: "Monitor z programem na Windows z wykresami i tabelą, z którego wysuwa się drugie okno. Napis: Program na Windows.",
  },
  {
    id: "fb-11-wycena", slot: "Tydzień 4 · środa", channel: "fb-ig", graphic: { kind: "guide", title: "Jak przygotować się do wyceny?", line: "Siedem rzeczy, które warto napisać w pierwszej wiadomości." },
    caption: `Nie musisz pisać specyfikacji, żeby dostać konkretną wycenę.

Wystarczy kilka zdań:
• czym zajmuje się firma
• co ma się zmienić po uruchomieniu
• kto będzie korzystał
• co jest niezbędne na start
• jakie materiały już masz
• termin i orientacyjny budżet

Przykład dobrej pierwszej wiadomości znajdziesz w poradniku 👉 emanuelwloch.pl/poradniki/jak-przygotowac-sie-do-wyceny`,
    hashtags: [...TAGS, "#poradnik"],
    alt: "Jasna grafika z tytułem poradnika: Jak przygotować się do wyceny?",
  },
  {
    id: "fb-12-o-mnie", slot: "Tydzień 4 · piątek", channel: "fb-ig", graphic: { kind: "about" },
    caption: `Cześć, jestem Emanuel. Projektuję i programuję strony, sklepy, aplikacje z bazą danych i programy na Windows dla firm z Jarosławia, Podkarpacia i całej Polski.

Pracujesz bezpośrednio ze mną: od pierwszej rozmowy, przez projekt i kod, po wdrożenie. Bez pośredników i przekazywania sprawy dalej.

Masz pomysł albo problem do rozwiązania? Napisz kilka zdań 👉 emanuelwloch.pl/#kontakt`,
    hashtags: [...TAGS, "#programista", "#freelancer"],
    alt: "Zdjęcie Emanuela Włocha obok napisu: Od pierwszej rozmowy do wdrożenia pracujesz ze mną.",
  },

  // —— Profil Firmy w Google (co tydzień, dwa wpisy) ——
  {
    id: "gbp-01-strony", slot: "Tydzień 1", channel: "gbp", graphic: { kind: "service", path: 0 },
    caption: `Strony internetowe dla firm z Jarosławia i okolic. Oferta, realizacje i wygodny kontakt na każdym ekranie, wersja na telefon i podstawy SEO. Strona firmowa od 600 zł netto, dokładna wycena po krótkiej rozmowie.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/tworzenie-stron-internetowych-jaroslaw` },
    alt: "Strona firmowa na laptopie i telefonie.",
  },
  {
    id: "gbp-02-fundacja", slot: "Tydzień 1", channel: "gbp",
    graphic: { kind: "case", slug: "fundacja-serce-mototrasy-strona-internetowa-organizacji-charytatywnej", title: "Fundacja Serce Mototrasy", type: "Strona organizacji", line: "Fundacja motocyklistów z Jarosławia: komu pomaga i jak dołączyć.", mockup: "/mockups/fundacja-serce-mototrasy-strona-internetowa-organizacji-charytatywnej.webp" },
    caption: `Realizacja z Jarosławia: strona Fundacji Serce Mototrasy. Wyjaśnia, komu fundacja pomaga, co robi i jak dołączyć do jej działań, tak żeby osoba, która pierwszy raz o niej słyszy, szybko znalazła sposób pomocy.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/projekty/fundacja-serce-mototrasy-strona-internetowa-organizacji-charytatywnej` },
    alt: "Strona Fundacji Serce Mototrasy na laptopie i monitorze.",
  },
  {
    id: "gbp-03-sklepy", slot: "Tydzień 2", channel: "gbp", graphic: { kind: "service", path: 1 },
    caption: `Sklepy internetowe z panelem zamówień. Katalog z filtrami, koszyk, płatności i dostawa dopasowane do Twoich klientów, a produkty i ceny zmieniasz sam. Sklep od 1800 zł netto.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/sklepy-internetowe` },
    alt: "Sklep internetowy na laptopie.",
  },
  {
    id: "gbp-04-opinia", slot: "Tydzień 2", channel: "gbp", graphic: { kind: "quote" },
    caption: `„Projekt jest bardzo świeży, nowoczesny, a zarazem ciepły w odbiorze.” Joanna Michno, Zielona Baza. Dziękuję za opinię! Zobacz realizacje stron, sklepów i aplikacji na emanuelwloch.pl.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/realizacje` },
    alt: "Cytat z opinii klientki na jasnym tle.",
  },
  {
    id: "gbp-05-aplikacje", slot: "Tydzień 3", channel: "gbp", graphic: { kind: "service", path: 2 },
    caption: `Aplikacje webowe dla firm: rezerwacje, zlecenia, obsługa klientów. Działają w przeglądarce, z logowaniem i rolami, dopasowane do tego, jak pracuje Twój zespół. Od 1200 zł netto.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/tworzenie-aplikacji-webowych` },
    alt: "Aplikacja webowa na monitorze.",
  },
  {
    id: "gbp-06-bazy", slot: "Tydzień 3", channel: "gbp", graphic: { kind: "service", path: 3 },
    caption: `Dane w arkuszach i mailach? Przeniosę je do jednej bazy z panelem: wyszukiwanie w kilka sekund, role dostępu i eksport do arkusza. Wycena po rozmowie.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/bazy-danych-i-panele` },
    alt: "Baza danych i panel produktów.",
  },
  {
    id: "gbp-07-programy", slot: "Tydzień 4", channel: "gbp", graphic: { kind: "service", path: 4 },
    caption: `Programy na Windows na zamówienie: ewidencja, analiza danych, raporty i eksport. Działają bez internetu, z lokalną bazą danych. C# i .NET. Wycena po rozmowie.`,
    cta: { button: "Dowiedz się więcej", url: `${SITE}/programy-na-windows` },
    alt: "Program na Windows z wykresami.",
  },
  {
    id: "gbp-08-kontakt", slot: "Tydzień 4", channel: "gbp", graphic: { kind: "about" },
    caption: `Strona, sklep, aplikacja czy program? Nie musisz wiedzieć. Opisz, co chcesz usprawnić, a ja zaproponuję rozwiązanie z ceną i terminem. Wycena jest bezpłatna. Jarosław i cała Polska.`,
    cta: { button: "Zadzwoń teraz", url: "tel:+48725403682" },
    alt: "Zdjęcie Emanuela Włocha.",
  },
];

/** Social preview images (1200 × 630) for the site's own pages. */
export const ogImages: Array<{ file: string; graphic: Graphic }> = [
  { file: "home", graphic: { kind: "hero" } },
  { file: "tworzenie-stron-internetowych", graphic: { kind: "service", path: 0 } },
  { file: "sklepy-internetowe", graphic: { kind: "service", path: 1 } },
  { file: "tworzenie-aplikacji-webowych", graphic: { kind: "service", path: 2 } },
  { file: "bazy-danych-i-panele", graphic: { kind: "service", path: 3 } },
  { file: "programy-na-windows", graphic: { kind: "service", path: 4 } },
  { file: "realizacje", graphic: { kind: "case", slug: "", title: "Realizacje", type: "Strony · sklepy · aplikacje · programy", line: "Prawdziwe ekrany z projektów i opis, jaki problem rozwiązuje każdy z nich.", mockup: "/mockups/hero-site.webp" } },
  { file: "o-mnie", graphic: { kind: "about" } },
  { file: "poradniki", graphic: { kind: "guide", title: "Zanim zdecydujesz", line: "Konkretne odpowiedzi o kosztach, terminach i wyborze rozwiązania." } },
];
