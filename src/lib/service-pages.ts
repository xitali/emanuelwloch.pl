export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServicePageData {
  slug: string;
  path: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  directAnswer: string;
  serviceType: string;
  areas: string[];
  idealFor: string[];
  benefits: Array<{ title: string; description: string }>;
  deliverables: string[];
  process: Array<{ title: string; description: string }>;
  faq: FaqItem[];
  related: Array<{ href: string; label: string }>;
}

export const servicePages: ServicePageData[] = [
  {
    slug: "tworzenie-stron-internetowych",
    path: "/tworzenie-stron-internetowych",
    shortName: "Strony internetowe",
    metaTitle: "Tworzenie stron internetowych dla firm",
    metaDescription:
      "Projektuję szybkie i skuteczne strony internetowe dla firm. Responsywność, SEO techniczne, formularze, CMS i wdrożenie w jednym procesie.",
    eyebrow: "Strony firmowe i landing pages",
    title: "Tworzenie stron internetowych, które wspierają sprzedaż",
    lead:
      "Potrzebujesz nowej strony lub chcesz poprawić obecną? Przygotuję dla Ciebie stronę, na której pokażesz ofertę i ułatwisz klientom kontakt.",
    directAnswer:
      "Co oferujesz i dlaczego klient ma wybrać właśnie Ciebie? Pomogę Ci jasno to pokazać. Dostaniesz projekt dopasowany do telefonu, uporządkowaną ofertę, formularz kontaktowy i gotową stronę pod Twoją domeną. Zadbam też o techniczne przygotowanie do Google.",
    serviceType: "Projektowanie i tworzenie stron internetowych",
    areas: ["Jarosław", "Rzeszów", "Podkarpackie", "Polska"],
    idealFor: [
      "Prowadzisz firmę usługową i chcesz pokazać ją w internecie.",
      "Masz stronę, która ładuje się zbyt długo lub trudno znaleźć na niej ofertę.",
      "Wprowadzasz nową usługę lub potrzebujesz strony do kampanii.",
    ],
    benefits: [
      {
        title: "Czytelna oferta",
        description:
          "Pomogę Ci pokazać, co oferujesz, komu pomagasz i jak można się z Tobą skontaktować.",
      },
      {
        title: "Przygotowanie do Google",
        description:
          "Przygotuję Twoją stronę do odczytania przez Google: od tytułów podstron po mapę strony i dane o firmie.",
      },
      {
        title: "Szybkość na telefonie",
        description:
          "Zadbam o zdjęcia i ładowanie treści, żeby Twoi klienci wygodnie korzystali ze strony na telefonie.",
      },
      {
        title: "Gotowe wdrożenie",
        description:
          "Pomogę Ci z adresem strony i hostingiem. Opublikuję stronę i pokażę Ci, jak z niej korzystać.",
      },
    ],
    deliverables: [
      "plan treści i sekcji Twojej strony",
      "projekt Twojej strony dopasowany do telefonu i komputera",
      "formularz kontaktowy z walidacją",
      "techniczne przygotowanie Twojej strony do Google",
      "optymalizacja obrazów oraz wydajności",
      "publikacja i instrukcja dalszej obsługi",
    ],
    process: [
      {
        title: "Rozpoznanie celu",
        description:
          "Opowiedz, co oferujesz, do kogo chcesz dotrzeć i do czego potrzebujesz strony.",
      },
      {
        title: "Struktura i projekt",
        description:
          "Zobaczysz propozycję wyglądu i układu Twojej strony. Powiesz mi, co chcesz zmienić.",
      },
      {
        title: "Kod i testy",
        description:
          "Dostaniesz wersję testową. Sprawdzę jej działanie na telefonie, formularze i nawigację.",
      },
      {
        title: "Publikacja",
        description:
          "Uruchomię stronę pod Twoją domeną i wyjaśnię Ci, jak wprowadzać kolejne zmiany.",
      },
    ],
    faq: [
      {
        question: "Ile kosztuje stworzenie strony internetowej?",
        answer:
          "Najprostszy zakres strony firmowej w kalkulatorze zaczyna się od 600 zł netto. Dokładna cena zależy od liczby widoków, treści, CMS, formularzy i integracji, dlatego przed rozpoczęciem przygotowuję konkretny zakres.",
      },
      {
        question: "Ile trwa wykonanie strony firmowej?",
        answer:
          "Prosta strona zwykle wymaga kilku tygodni pracy. Termin zależy przede wszystkim od zakresu, gotowości treści oraz liczby rund akceptacji i jest ustalany przed startem.",
      },
      {
        question: "Czy strona będzie widoczna w Google?",
        answer:
          "Przygotowuję stronę do indeksowania i wdrażam SEO techniczne. Nie obiecuję konkretnej pozycji, ponieważ zależy ona również od konkurencji, jakości treści, historii domeny i linków zewnętrznych.",
      },
      {
        question: "Czy będę mógł sam edytować treści?",
        answer:
          "Tak, jeżeli projekt tego wymaga, mogę dodać panel CMS do edycji tekstów, zdjęć, usług lub aktualności bez ingerencji w kod.",
      },
      {
        question: "Czy pomagasz z domeną i hostingiem?",
        answer:
          "Tak. Mogę skonfigurować domenę, DNS, certyfikat HTTPS, hosting oraz automatyczne wdrożenia.",
      },
      {
        question: "WordPress czy Next.js — co wybrać?",
        answer:
          "Wybór zależy od sposobu edycji treści, wymaganych integracji i planów rozwoju. Nie dobieram technologii dla samej technologii — rekomenduję rozwiązanie po poznaniu celu projektu.",
      },
      {
        question: "Czy pracujesz zdalnie z firmami z całej Polski?",
        answer:
          "Tak. Działam z Jarosławia, a cały proces — konsultacje, akceptacje i wdrożenie — może odbyć się zdalnie.",
      },
    ],
    related: [
      { href: "/tworzenie-stron-internetowych-jaroslaw", label: "Strony internetowe Jarosław" },
      { href: "/tworzenie-stron-internetowych-rzeszow", label: "Strony internetowe Rzeszów" },
      { href: "/nextjs-developer", label: "Next.js developer" },
    ],
  },
  {
    slug: "tworzenie-aplikacji-webowych",
    path: "/tworzenie-aplikacji-webowych",
    shortName: "Aplikacje webowe",
    metaTitle: "Tworzenie aplikacji webowych i paneli",
    metaDescription:
      "Tworzę dedykowane aplikacje webowe, panele administracyjne i MVP: frontend, backend, baza danych, autoryzacja, testy i wdrożenie.",
    eyebrow: "Aplikacja do Twoich zadań",
    title: "Aplikacje webowe dopasowane do procesu Twojej firmy",
    lead:
      "Chcesz uporządkować zamówienia, rezerwacje lub pracę zespołu? Stworzę dla Ciebie aplikację dopasowaną do tego, jak działa Twoja firma.",
    directAnswer:
      "Aplikację otworzysz w przeglądarce na komputerze lub telefonie. Możesz w niej obsługiwać klientów, rezerwacje, dane i zadania zespołu. Najpierw opowiesz mi, jak dziś pracujesz. Potem wybierzemy potrzebne funkcje, a ja zaprojektuję i uruchomię rozwiązanie.",
    serviceType: "Projektowanie i tworzenie aplikacji webowych",
    areas: ["Jarosław", "Rzeszów", "Podkarpackie", "Polska"],
    idealFor: [
      "Chcesz zastąpić arkusze i ręczne zadania jednym panelem.",
      "Chcesz sprawdzić pomysł na aplikację w podstawowej, działającej wersji.",
      "Masz aplikację i potrzebujesz nowych funkcji lub połączenia z innym systemem.",
    ],
    benefits: [
      {
        title: "Twoja codzienna praca",
        description:
          "Pokaż mi, jak pracujesz. Ustalimy, które zadania aplikacja ma ułatwić Tobie i Twojemu zespołowi.",
      },
      {
        title: "Cała aplikacja u jednego wykonawcy",
        description:
          "Otrzymasz zarówno ekrany aplikacji, jak i działające zaplecze. Nie musisz szukać osobnego wykonawcy do każdej części.",
      },
      {
        title: "Dostęp pod kontrolą",
        description:
          "Ustalimy, kto ma dostęp do danych i funkcji. Zabezpieczę logowanie i sprawdzę dane przesyłane do aplikacji.",
      },
      {
        title: "Rozwój bez przepisywania",
        description:
          "Możesz zacząć od najważniejszych funkcji. Przygotuję aplikację tak, żeby dało się ją później rozwijać.",
      },
    ],
    deliverables: [
      "opis tego, kto i do czego będzie używał Twojej aplikacji",
      "plan danych i działania Twojej aplikacji",
      "responsywny interfejs użytkownika",
      "zaplecze aplikacji i połączenia z potrzebnymi systemami",
      "logowanie oraz kontrola dostępu",
      "testy, wdrożenie i dokumentacja zakresu",
    ],
    process: [
      {
        title: "Analiza procesu",
        description:
          "Opowiedz, kto będzie korzystać z Twojej aplikacji i jakie zadania ma w niej wykonywać.",
      },
      {
        title: "Funkcje na początek",
        description:
          "Wspólnie wybierzemy funkcje potrzebne na start i te, które możesz zamówić później.",
      },
      {
        title: "Regularne podglądy",
        description:
          "Regularnie zobaczysz działające fragmenty aplikacji i powiesz mi, co wymaga dopracowania.",
      },
      {
        title: "Uruchomienie i rozwój",
        description:
          "Uruchomię Twoją aplikację, sprawdzę kluczowe zadania i omówię z Tobą dalszy rozwój.",
      },
    ],
    faq: [
      {
        question: "Czym aplikacja webowa różni się od zwykłej strony?",
        answer:
          "Strona przede wszystkim prezentuje informacje. Aplikacja obsługuje procesy i dane: logowanie, role, formularze, rezerwacje, raporty, płatności lub panel administracyjny.",
      },
      {
        question: "Ile kosztuje aplikacja webowa?",
        answer:
          "Kalkulator pokazuje punkt startowy od 1200 zł netto dla podstawowego zakresu. Rzeczywisty budżet zależy od liczby ról, ekranów, integracji, modelu danych i wymagań bezpieczeństwa.",
      },
      {
        question: "Czy możesz stworzyć najpierw MVP?",
        answer:
          "Tak. Zaczniemy od podstawowej wersji aplikacji, czyli MVP. Sprawdzisz, czy rozwiązuje Twój problem, zanim zamówisz kolejne funkcje.",
      },
      {
        question: "Czy aplikacja otrzyma panel administratora?",
        answer:
          "Tak, jeżeli zarządzanie użytkownikami, treścią lub danymi jest częścią procesu, projektuję również chroniony panel administracyjny.",
      },
      {
        question: "Jak zabezpieczasz dane i logowanie?",
        answer:
          "Stosuję walidację danych, bezpieczne sesje, haszowanie haseł, kontrolę uprawnień, limity żądań i minimalny dostęp do sekretów.",
      },
      {
        question: "Czy integrujesz zewnętrzne API?",
        answer:
          "Tak. Mogę połączyć aplikację między innymi z płatnościami, pocztą, kalendarzem, mapami, magazynem plików lub systemem klienta, jeśli API na to pozwala.",
      },
      {
        question: "Czy rozwijasz istniejące aplikacje?",
        answer:
          "Tak. Przed zmianami wykonuję audyt kodu, zależności, bezpieczeństwa i modelu danych, a następnie proponuję bezpieczną kolejność prac.",
      },
    ],
    related: [
      { href: "/nextjs-developer", label: "Rozwój aplikacji Next.js" },
      { href: "/sklepy-internetowe", label: "Sklepy internetowe" },
      { href: "/tworzenie-stron-internetowych", label: "Strony firmowe" },
    ],
  },
  {
    slug: "sklepy-internetowe",
    path: "/sklepy-internetowe",
    shortName: "Sklepy internetowe",
    metaTitle: "Tworzenie sklepów internetowych",
    metaDescription:
      "Projektuję szybkie sklepy internetowe i dedykowane ścieżki zakupowe. Produkty, płatności, panel, SEO techniczne i wdrożenie.",
    eyebrow: "E-commerce i sprzedaż online",
    title: "Sklepy internetowe z prostą ścieżką do zakupu",
    lead:
      "Chcesz zacząć sprzedawać online lub zmienić obecny sklep? Przygotuję dla Ciebie czytelny katalog, wygodne zakupy i panel do obsługi zamówień.",
    directAnswer:
      "Powiedz, co sprzedajesz, ile masz produktów i jak wysyłasz zamówienia. Na tej podstawie dobierzemy katalog, płatności, dostawę i sposób zarządzania. Twój klient wygodnie zrobi zakupy również na telefonie.",
    serviceType: "Projektowanie i tworzenie sklepów internetowych",
    areas: ["Jarosław", "Rzeszów", "Podkarpackie", "Polska"],
    idealFor: [
      "Zaczynasz sprzedawać swoje produkty w internecie.",
      "Chcesz poprawić sklep, który jest wolny lub trudny w obsłudze.",
      "Potrzebujesz zakupów dopasowanych do specyfiki swoich produktów.",
    ],
    benefits: [
      {
        title: "Zakup bez przeszkód",
        description:
          "Twoi klienci łatwo znajdą produkt, poznają jego cenę i przejdą do zamówienia.",
      },
      {
        title: "Bezpieczne płatności",
        description:
          "Wybierzesz operatora płatności, którego połączę z Twoim sklepem. Dane kart obsłuży operator.",
      },
      {
        title: "SEO produktów",
        description:
          "Przygotuję kategorie i karty Twoich produktów tak, żeby Google mogło je odczytać i indeksować.",
      },
      {
        title: "Panel i automatyzacje",
        description:
          "Z panelu zmienisz produkty i ceny. Jeśli potrzebujesz, połączę sklep z Twoim magazynem lub powiadomieniami.",
      },
    ],
    deliverables: [
      "architektura kategorii i produktów",
      "responsywny katalog oraz karty produktów",
      "koszyk i proces składania zamówienia",
      "integracja płatności i powiadomień",
      "panel zarządzania ofertą",
      "SEO techniczne, analityka i wdrożenie",
    ],
    process: [
      {
        title: "Model sprzedaży",
        description:
          "Co chcesz sprzedawać i jak realizujesz zamówienia? Wybierzemy odpowiednie płatności i dostawę.",
      },
      {
        title: "Ścieżka klienta",
        description:
          "Zobaczysz, jak Twój klient wybierze produkt, doda go do koszyka i złoży zamówienie.",
      },
      {
        title: "Integracje i testy",
        description:
          "Przed startem sprawdzę Twój sklep: zamówienia, płatności, wiadomości i widok na telefonie.",
      },
      {
        title: "Uruchomienie sprzedaży",
        description:
          "Uruchomię Twój sklep i pokażę Ci, jak dodawać produkty oraz obsługiwać zamówienia.",
      },
    ],
    faq: [
      {
        question: "Ile kosztuje stworzenie sklepu internetowego?",
        answer:
          "Kalkulator pokazuje punkt startowy od 1800 zł netto. Dokładny koszt zależy od liczby produktów, wariantów, płatności, dostawy, panelu i integracji zewnętrznych.",
      },
      {
        question: "Czy sklep będzie działał na telefonie?",
        answer:
          "Tak. Katalog, koszyk i płatność projektuję mobile-first, ponieważ telefon jest często podstawowym urządzeniem zakupowym klienta.",
      },
      {
        question: "Jakie płatności można zintegrować?",
        answer:
          "Możliwe są między innymi Stripe, PayU lub Przelewy24. Ostateczny wybór zależy od kraju sprzedaży, modelu rozliczeń i dostępności operatora.",
      },
      {
        question: "Czy będę sam dodawać produkty?",
        answer:
          "Tak. Sklep może otrzymać panel do zarządzania produktami, cenami, zdjęciami, stanem dostępności i zamówieniami.",
      },
      {
        question: "Czy sklep może mieć warianty i promocje?",
        answer:
          "Tak. Rozmiary, kolory, warianty, kody rabatowe i reguły promocji uwzględniam w modelu produktu oraz wycenie.",
      },
      {
        question: "Czy zajmujesz się SEO sklepu?",
        answer:
          "Wdrażam techniczne podstawy SEO, strukturę kategorii i indeksowalne karty produktów. Treści produktowe oraz pozyskiwanie linków są osobnymi elementami strategii widoczności.",
      },
      {
        question: "Czy można połączyć sklep z innym systemem?",
        answer:
          "Tak, jeżeli system posiada odpowiednie API. Zakres może obejmować magazyn, fakturowanie, CRM, kurierów lub automatyczne powiadomienia.",
      },
    ],
    related: [
      { href: "/tworzenie-aplikacji-webowych", label: "Aplikacje webowe" },
      { href: "/nextjs-developer", label: "Next.js developer" },
      { href: "/tworzenie-stron-internetowych", label: "Strony internetowe" },
    ],
  },
  {
    slug: "nextjs-developer",
    path: "/nextjs-developer",
    shortName: "Next.js developer",
    metaTitle: "Next.js developer — aplikacje i audyty",
    metaDescription:
      "Next.js developer: nowe aplikacje, migracje, audyty, wydajność, bezpieczeństwo i rozwój istniejącego produktu w React i TypeScript.",
    eyebrow: "Next.js, React i TypeScript",
    title: "Next.js developer od interfejsu po produkcyjne wdrożenie",
    lead:
      "Masz aplikację w Next.js i potrzebujesz nowych funkcji lub poprawek? Sprawdzę jej kod, wyjaśnię problemy i zaproponuję kolejność prac. Mogę też zbudować dla Ciebie nowy projekt.",
    directAnswer:
      "Pomagam zarówno przy nowej aplikacji Next.js, jak i przy istniejącym kodzie wymagającym audytu, migracji lub poprawy wydajności. Pracuję z aktualnym App Routerem, TypeScript, walidacją danych, relacyjnymi bazami i wdrożeniami Vercel.",
    serviceType: "Tworzenie i rozwój aplikacji Next.js",
    areas: ["Polska", "współpraca zdalna"],
    idealFor: [
      "Chcesz zbudować nową aplikację w Next.js.",
      "Masz starszą aplikację Next.js i chcesz ją zaktualizować.",
      "Potrzebujesz sprawdzenia kodu, szybkości lub bezpieczeństwa aplikacji.",
    ],
    benefits: [
      {
        title: "Aktualne API",
        description:
          "Sprawdzę wersję i dokumentację narzędzi w Twoim projekcie, żeby zmiany pasowały do obecnego kodu.",
      },
      {
        title: "Rozsądny rendering",
        description:
          "Dobiorę sposób ładowania Twojej aplikacji, żeby nie pobierała niepotrzebnego kodu.",
      },
      {
        title: "Granice bezpieczeństwa",
        description:
          "Sprawdzę, czy dostęp do danych w Twojej aplikacji mają tylko uprawnione osoby.",
      },
      {
        title: "Produkcja pod kontrolą",
        description:
          "Przed publikacją sprawdzę kod i testy Twojej aplikacji. Po wdrożeniu skontroluję najważniejsze funkcje.",
      },
    ],
    deliverables: [
      "audyt architektury i zależności",
      "aplikacja Next.js z TypeScript",
      "Server Components i Route Handlers",
      "integracja bazy danych oraz walidacji",
      "optymalizacja Wygodne korzystanie na telefonie",
      "testy, CI i wdrożenie produkcyjne",
    ],
    process: [
      {
        title: "Diagnoza",
        description:
          "Pokaż mi swój projekt i opisz problem. Sprawdzę kod i przedstawię Ci wnioski.",
      },
      {
        title: "Plan techniczny",
        description:
          "Dostaniesz plan poprawek z podziałem na etapy. Ustalimy, od czego zacząć.",
      },
      {
        title: "Implementacja",
        description:
          "Zobaczysz postępy na wersji testowej. Wyjaśnię Ci, co zostało zmienione i dlaczego.",
      },
      {
        title: "Kontrola produkcji",
        description:
          "Po testach opublikuję zmiany i sprawdzę najważniejsze zadania w Twojej aplikacji.",
      },
    ],
    faq: [
      {
        question: "Czy tworzysz nowe aplikacje w Next.js?",
        answer:
          "Tak. Mogę przygotować frontend, backend w Route Handlers lub Server Actions, bazę danych, logowanie, panel i wdrożenie.",
      },
      {
        question: "Czy wykonujesz audyt istniejącego projektu Next.js?",
        answer:
          "Tak. Audyt obejmuje architekturę, bezpieczeństwo, wydajność, zależności, SEO techniczne i proces publikacji. Najpierw raportuję przyczyny, a dopiero później uzgadniam poprawki.",
      },
      {
        question: "Czy migrujesz Pages Router do App Routera?",
        answer:
          "Tak, ale migrację planuję etapami. Najpierw identyfikuję zależności od starego routingu i ryzyka związane z cache, sesjami oraz pobieraniem danych.",
      },
      {
        question: "Czy Next.js nadaje się do SEO?",
        answer:
          "Tak. Next.js wspiera renderowanie serwerowe, statyczne strony, metadane, sitemapę i dane strukturalne. O wyniku SEO nadal decydują także treść, intencja, linki i konkurencja.",
      },
      {
        question: "Czy optymalizujesz Wygodne korzystanie na telefonie?",
        answer:
          "Tak. Analizuję obrazy, fonty, JavaScript, stabilność layoutu, sposób renderowania oraz rzeczywiste wąskie gardła zamiast optymalizować wynik bez kontekstu.",
      },
      {
        question: "Czy wdrażasz aplikacje na Vercel?",
        answer:
          "Tak. Konfiguruję projekt, domenę, zmienne środowiskowe, cache i automatyczne wdrożenia z repozytorium.",
      },
      {
        question: "Czy przejmujesz projekt po innym wykonawcy?",
        answer:
          "Tak, jeżeli mam dostęp do kodu i środowiska. Zaczynam od audytu, aby oddzielić błędy, dług techniczny i ryzyka od nowych funkcji.",
      },
    ],
    related: [
      { href: "/tworzenie-aplikacji-webowych", label: "Aplikacje webowe" },
      { href: "/tworzenie-stron-internetowych", label: "Strony internetowe" },
      { href: "/sklepy-internetowe", label: "Sklepy internetowe" },
    ],
  },
  {
    slug: "tworzenie-stron-internetowych-jaroslaw",
    path: "/tworzenie-stron-internetowych-jaroslaw",
    shortName: "Strony internetowe Jarosław",
    metaTitle: "Tworzenie stron internetowych Jarosław",
    metaDescription:
      "Tworzenie stron internetowych w Jarosławiu. Szybkie strony firmowe, SEO techniczne, responsywność, formularze i wdrożenie.",
    eyebrow: "Jarosław i Podkarpacie",
    title: "Tworzenie stron internetowych w Jarosławiu",
    lead:
      "Prowadzisz firmę w Jarosławiu lub okolicy? Stworzę dla Ciebie stronę, na której jasno pokażesz ofertę i ułatwisz klientom kontakt.",
    directAnswer:
      "Opowiedz mi o swojej firmie i klientach, do których chcesz dotrzeć. Przygotuję projekt, pomogę uporządkować ofertę i uruchomię stronę pod Twoją domeną. Możemy uzgadniać wszystko zdalnie, a potrzebne decyzje wyjaśnię Ci na bieżąco.",
    serviceType: "Tworzenie stron internetowych w Jarosławiu",
    areas: ["Jarosław", "powiat jarosławski", "Podkarpackie", "Polska"],
    idealFor: [
      "Oferujesz usługi w Jarosławiu lub okolicy.",
      "Prowadzisz lokalną firmę, restaurację lub organizację.",
      "Chcesz dotrzeć do klientów z Jarosławia i regionu.",
    ],
    benefits: [
      {
        title: "Lokalny kontekst",
        description:
          "Twoją ofertę przygotuję z myślą o tym, czego szukają klienci w Jarosławiu i okolicy.",
      },
      {
        title: "Wiarygodna prezentacja",
        description:
          "Pokażesz swoje usługi, realizacje i obszar działania. Klient łatwo znajdzie Twój kontakt.",
      },
      {
        title: "Twoja firma w Google",
        description:
          "Przygotuję tytuły podstron i dane o Twojej firmie, żeby wyszukiwarka mogła poprawnie odczytać ofertę.",
      },
      {
        title: "Obsługa po publikacji",
        description:
          "Potrzebujesz zmian po publikacji? Możesz wrócić do mnie z nową ofertą, treściami lub problemem technicznym.",
      },
    ],
    deliverables: [
      "struktura oferty lokalnej firmy",
      "responsywny projekt dopasowany do marki",
      "czytelne dane kontaktowe i obszar działania",
      "SEO techniczne i konfiguracja indeksowania",
      "formularz oraz mierzenie kontaktów",
      "domena, HTTPS i publikacja",
    ],
    process: [
      {
        title: "Oferta i rynek",
        description:
          "Jakie usługi chcesz promować i skąd mają pochodzić Twoi klienci?",
      },
      {
        title: "Treść oraz zaufanie",
        description:
          "Wspólnie wybierzemy, co pokazać na Twojej stronie: usługi, realizacje i odpowiedzi na pytania klientów.",
      },
      {
        title: "Projekt i wykonanie",
        description:
          "Przygotuję Twoją stronę do wygodnej obsługi na telefonie i do obecności w Google.",
      },
      {
        title: "Publikacja i zgłoszenie",
        description:
          "Uruchomię Twoją stronę i pomogę Ci zgłosić ją do Google.",
      },
    ],
    faq: [
      {
        question: "Czy tworzysz strony dla firm z Jarosławia?",
        answer:
          "Tak. Działam z Jarosławia i realizuję strony dla lokalnych firm, organizacji oraz klientów z całej Polski.",
      },
      {
        question: "Czy lokalna firma potrzebuje osobnej strony pod Jarosław?",
        answer:
          "Nie zawsze. Osobny landing ma sens wtedy, gdy firma rzeczywiście obsługuje ten rynek i może opisać lokalną ofertę, realizacje lub sposób kontaktu bez kopiowania treści z innych miast.",
      },
      {
        question: "Jak przygotowujesz stronę pod lokalne SEO?",
        answer:
          "Dbam o spójne dane, lokalny kontekst treści, czytelny obszar działania, metadane, dane strukturalne, szybkość i indeksowalne podstrony usług.",
      },
      {
        question: "Czy muszę mieć Google Business Profile?",
        answer:
          "Profil może pomóc firmom obsługującym klientów lokalnie, ale musi spełniać zasady Google i odpowiadać rzeczywistemu modelowi działalności. Sama strona może być indeksowana bez profilu.",
      },
      {
        question: "Ile kosztuje strona dla lokalnej firmy?",
        answer:
          "Punkt startowy prostego zakresu w kalkulatorze wynosi 600 zł netto. Ostateczna wycena zależy od treści, liczby usług, formularzy, galerii, CMS i integracji.",
      },
      {
        question: "Czy możemy współpracować całkowicie zdalnie?",
        answer:
          "Tak. Materiały, konsultacje, akceptacje i publikację można przeprowadzić zdalnie.",
      },
      {
        question: "Czy pomożesz poprawić istniejącą stronę?",
        answer:
          "Tak. Najpierw sprawdzam kod, treść, indeksowanie, wydajność i bezpieczeństwo, a następnie proponuję kolejność poprawek.",
      },
    ],
    related: [
      { href: "/tworzenie-stron-internetowych", label: "Tworzenie stron internetowych" },
      { href: "/tworzenie-stron-internetowych-rzeszow", label: "Strony internetowe Rzeszów" },
      { href: "/o-mnie", label: "Poznaj wykonawcę" },
    ],
  },
  {
    slug: "tworzenie-stron-internetowych-rzeszow",
    path: "/tworzenie-stron-internetowych-rzeszow",
    shortName: "Strony internetowe Rzeszów",
    metaTitle: "Tworzenie stron internetowych Rzeszów",
    metaDescription:
      "Tworzenie stron internetowych dla firm z Rzeszowa. Responsywność, SEO techniczne, Wygodne korzystanie na telefonie, formularze i wdrożenie.",
    eyebrow: "Rzeszów i Podkarpacie",
    title: "Tworzenie stron internetowych dla firm z Rzeszowa",
    lead:
      "Prowadzisz firmę w Rzeszowie? Pomogę Ci pokazać usługi, realizacje i kontakt na stronie, którą wygodnie otworzą także klienci z telefonu.",
    directAnswer:
      "Powiedz, jakie usługi chcesz pokazać i do kogo dotrzeć. Dostaniesz projekt, działającą stronę, formularz kontaktowy i przygotowanie do Google. Działam z Jarosławia — cały projekt dla Twojej firmy z Rzeszowa możemy przeprowadzić zdalnie.",
    serviceType: "Tworzenie stron internetowych dla firm z Rzeszowa",
    areas: ["Rzeszów", "Jarosław", "Podkarpackie", "Polska"],
    idealFor: [
      "Oferujesz usługi klientom z Rzeszowa.",
      "Chcesz lepiej pokazać swoją ofertę i dotychczasowe realizacje.",
      "Przygotowujesz kampanię i potrzebujesz strony dla swojej oferty.",
    ],
    benefits: [
      {
        title: "Odpowiedzi na pytania klientów",
        description:
          "Twoi klienci znajdą odpowiedzi o usługach, obszarze działania i sposobie współpracy.",
      },
      {
        title: "Prosta droga do kontaktu",
        description:
          "Pokażesz ofertę i realizacje, a klient łatwo przejdzie do telefonu lub wiadomości.",
      },
      {
        title: "Wygodne korzystanie na telefonie",
        description:
          "Zadbam o ładowanie Twojej strony i stabilny układ, także na telefonie.",
      },
      {
        title: "Mierzalne działania",
        description:
          "Jeśli chcesz, dodam pomiar kliknięć telefonu, formularza i mapy. Zobaczysz, z czego korzystają odwiedzający.",
      },
    ],
    deliverables: [
      "omówienie Twojej oferty i potrzeb lokalnych klientów",
      "struktura strony oraz projekt responsywny",
      "sekcje usług, realizacji i FAQ",
      "formularz oraz czytelne dane kontaktowe",
      "techniczne przygotowanie Twojej strony do Google",
      "publikacja, domena i podstawowa analityka",
    ],
    process: [
      {
        title: "Cel biznesowy",
        description:
          "Jakie usługi chcesz promować w Rzeszowie i do jakich klientów chcesz dotrzeć?",
      },
      {
        title: "Struktura odpowiedzi",
        description:
          "Pomogę Ci odpowiedzieć na pytania Twoich klientów i pokazać, dlaczego warto wybrać Twoją firmę.",
      },
      {
        title: "Projekt i testy",
        description:
          "Zobaczysz działającą stronę. Sprawdzę kontakt, wyświetlanie na telefonie i szybkość ładowania.",
      },
      {
        title: "Indeksowanie i rozwój",
        description:
          "Opublikuję Twoją stronę, przygotuję ją do Google i podpowiem, jakie treści warto dodać później.",
      },
    ],
    faq: [
      {
        question: "Czy pracujesz tylko z klientami z Rzeszowa?",
        answer:
          "Nie. Działam z Jarosławia na Podkarpaciu, obsługuję firmy z Rzeszowa, a cały proces mogę przeprowadzić zdalnie dla klienta z dowolnego miejsca w Polsce.",
      },
      {
        question: "Ile kosztuje strona internetowa w Rzeszowie?",
        answer:
          "Najprostszy zakres w kalkulatorze zaczyna się od 600 zł netto. Cena zależy od liczby usług i podstron, treści, formularzy, CMS, galerii oraz integracji.",
      },
      {
        question: "Czy strona będzie działać na telefonie?",
        answer:
          "Tak. Responsywność i czytelna obsługa na małych ekranach są częścią każdej realizacji, a nie dodatkowo płatnym modułem.",
      },
      {
        question: "Czy przygotujesz stronę pod SEO w Rzeszowie?",
        answer:
          "Wdrażam SEO techniczne i tworzę strukturę treści zgodną z lokalną intencją. Nie gwarantuję pozycji, ponieważ wpływają na nią również konkurencja, autorytet domeny i zewnętrzne wzmianki.",
      },
      {
        question: "Czy pomagasz z Google Search Console?",
        answer:
          "Tak. Przygotuję Twoją stronę do zgłoszenia i pomogę Ci przejść przez konfigurację. Czynności wymagające dostępu do Twojego konta Google wykonasz po swojej stronie.",
      },
      {
        question: "Czy mogę później sam zmieniać treści?",
        answer:
          "Tak. W zależności od zakresu mogę wdrożyć panel CMS lub przygotować prostą procedurę aktualizacji strony.",
      },
      {
        question: "Co jest potrzebne do rozpoczęcia projektu?",
        answer:
          "Napisz, czym się zajmujesz i w czym strona ma Ci pomóc. Jeśli masz zdjęcia, logo lub przykłady stron, dołącz je. Resztę ustalimy podczas rozmowy.",
      },
    ],
    related: [
      { href: "/tworzenie-stron-internetowych", label: "Tworzenie stron internetowych" },
      { href: "/tworzenie-stron-internetowych-jaroslaw", label: "Strony internetowe Jarosław" },
      { href: "/o-mnie", label: "O Emanuelu Włochu" },
    ],
  },
  {
    slug: "bazy-danych-i-panele",
    path: "/bazy-danych-i-panele",
    shortName: "Bazy danych i panele",
    metaTitle: "Bazy danych i panele zarządzania dla firm",
    metaDescription:
      "Przeniosę dane Twojej firmy z arkuszy i maili do uporządkowanej bazy danych z panelem: klienci, zamówienia, produkty, zgłoszenia i raporty.",
    eyebrow: "Dane firmy w jednym miejscu",
    title: "Baza danych i panel zamiast arkuszy i maili",
    lead:
      "Klienci w jednym arkuszu, zamówienia w mailach, ceny w zeszycie? Zbuduję bazę danych i panel, w którym Ty i Twój zespół znajdziecie wszystko w kilka sekund.",
    directAnswer:
      "Baza danych przechowuje informacje Twojej firmy w uporządkowany sposób, a panel pozwala je dodawać, wyszukiwać i zmieniać bez znajomości programowania. Najpierw sprawdzę, jakie dane dziś zbierasz i kto z nich korzysta. Potem zaprojektuję strukturę, przeniosę istniejące dane i przygotuję panel z dostępem dla odpowiednich osób.",
    serviceType: "Projektowanie baz danych i paneli administracyjnych",
    areas: ["Jarosław", "Rzeszów", "Podkarpackie", "Polska"],
    idealFor: [
      "Te same dane wpisujesz w kilku miejscach i łatwo o pomyłkę.",
      "Szukanie zamówienia, klienta lub produktu zajmuje Ci za dużo czasu.",
      "Chcesz, żeby pracownicy widzieli tylko te dane, których potrzebują.",
    ],
    benefits: [
      {
        title: "Jedno źródło danych",
        description:
          "Klienci, zamówienia, produkty czy zgłoszenia trafiają do jednej bazy. Nie musisz porównywać kilku arkuszy.",
      },
      {
        title: "Panel do codziennej pracy",
        description:
          "Wyszukujesz, filtrujesz i edytujesz dane w przeglądarce. Panel projektuję pod zadania, które wykonujesz najczęściej.",
      },
      {
        title: "Dostęp według ról",
        description:
          "Ustalimy, kto może przeglądać, a kto zmieniać dane. Logowanie zabezpieczę, a uprawnienia sprawdzę przed uruchomieniem.",
      },
      {
        title: "Przeniesienie obecnych danych",
        description:
          "Zaimportuję Twoje arkusze lub eksporty z innych programów i sprawdzę, czy nic nie zginęło po drodze.",
      },
    ],
    deliverables: [
      "mapa danych: co przechowujemy, skąd to pochodzi i kto z tego korzysta",
      "baza danych z kopiami zapasowymi",
      "panel do przeglądania, wyszukiwania i edycji danych",
      "role użytkowników i zabezpieczone logowanie",
      "import danych z arkuszy lub innych systemów",
      "eksport danych i krótka instrukcja obsługi",
    ],
    process: [
      {
        title: "Przegląd obecnych danych",
        description:
          "Pokażesz mi arkusze, formularze i maile, z których dziś korzystasz. Ustalimy, czego brakuje i co się powtarza.",
      },
      {
        title: "Struktura i panel",
        description:
          "Zaprojektuję bazę i ekrany panelu. Zobaczysz je, zanim zacznę programować.",
      },
      {
        title: "Import i testy",
        description:
          "Przeniosę dane, a Ty sprawdzisz panel na prawdziwych przykładach ze swojej firmy.",
      },
      {
        title: "Uruchomienie",
        description:
          "Uruchomię panel, nadam dostępy Tobie i zespołowi oraz pokażę, jak z niego korzystać.",
      },
    ],
    faq: [
      {
        question: "Czy muszę rezygnować z Excela?",
        answer:
          "Nie od razu. Panel może eksportować dane do arkusza, a istniejące pliki mogę zaimportować do bazy. Arkusz zostaje narzędziem do analizy, a nie jedynym miejscem przechowywania danych.",
      },
      {
        question: "Gdzie będą przechowywane moje dane?",
        answer:
          "Wybierzemy to razem: w chmurze, jeśli panel ma działać z różnych miejsc, albo lokalnie na komputerze, jeśli dane nie mogą opuszczać firmy. Przed startem wyjaśnię koszty utrzymania każdej opcji.",
      },
      {
        question: "Czy panel może łączyć się ze stroną lub sklepem?",
        answer:
          "Tak. Zamówienia ze sklepu, zapytania z formularza czy rezerwacje mogą trafiać bezpośrednio do tej samej bazy.",
      },
      {
        question: "Ile kosztuje baza danych z panelem?",
        answer:
          "Cena zależy od liczby rodzajów danych, ról użytkowników, importów i integracji. Po rozmowie dostaniesz zakres i dokładną wycenę netto.",
      },
      {
        question: "Czy pracownicy mogą mieć różne uprawnienia?",
        answer:
          "Tak. Każda rola widzi tylko potrzebne dane i funkcje, na przykład sprzedawca dodaje zamówienia, a właściciel widzi także raporty i ceny zakupu.",
      },
      {
        question: "Co z kopiami zapasowymi?",
        answer:
          "Ustalimy, jak często i gdzie powstają kopie bazy. Przed uruchomieniem sprawdzę, że kopię da się odtworzyć.",
      },
      {
        question: "Czy mogę zacząć od jednego rodzaju danych?",
        answer:
          "Tak. Często zaczynamy od jednej listy, na przykład klientów albo zamówień, a kolejne dodajemy, gdy panel sprawdzi się w codziennej pracy.",
      },
    ],
    related: [
      { href: "/tworzenie-aplikacji-webowych", label: "Aplikacje webowe" },
      { href: "/programy-na-windows", label: "Programy na Windows" },
      { href: "/poradniki/arkusz-czy-wlasna-aplikacja", label: "Poradnik: arkusz czy aplikacja?" },
    ],
  },
  {
    slug: "programy-na-windows",
    path: "/programy-na-windows",
    shortName: "Programy na Windows",
    metaTitle: "Programy na Windows na zamówienie",
    metaDescription:
      "Tworzę programy na Windows do konkretnych zadań w firmie: analiza danych, ewidencja, raporty i eksport. C#, .NET i lokalna baza danych.",
    eyebrow: "Aplikacje na komputer",
    title: "Program na Windows do konkretnego zadania w Twojej firmie",
    lead:
      "Potrzebujesz narzędzia, które działa na komputerze, także bez internetu? Napiszę program na Windows dopasowany do tego, jak pracujesz.",
    directAnswer:
      "Program instalujesz na komputerze i uruchamiasz jak każdą inną aplikację. Sprawdza się tam, gdzie dane mają zostać na miejscu, gdzie potrzebna jest praca bez internetu albo połączenie z urządzeniem lub plikami na dysku. Piszę w C# i .NET, z lokalną bazą danych, eksportem do plików i czytelnym interfejsem.",
    serviceType: "Tworzenie oprogramowania na Windows",
    areas: ["Jarosław", "Rzeszów", "Podkarpackie", "Polska"],
    idealFor: [
      "Dane mają zostać na komputerze w firmie.",
      "Program ma działać bez stałego dostępu do internetu.",
      "Potrzebujesz narzędzia do analizy, ewidencji lub raportów zamiast ręcznego liczenia.",
    ],
    benefits: [
      {
        title: "Praca na miejscu",
        description:
          "Program działa na Twoim komputerze. Dane zapisuje w lokalnej bazie, więc nie zależysz od połączenia z internetem.",
      },
      {
        title: "Czytelne zestawienia",
        description:
          "Zamiast surowych liczb zobaczysz wykresy, podsumowania i historię zmian, które łatwo porównać.",
      },
      {
        title: "Eksport i kopie",
        description:
          "Dane wyeksportujesz do pliku CSV i przeniesiesz do arkusza lub innego programu.",
      },
      {
        title: "Dopasowany do zadania",
        description:
          "Program robi to, czego potrzebujesz, bez funkcji, za które nie chcesz płacić.",
      },
    ],
    deliverables: [
      "opis zadań, które program ma wykonywać",
      "projekt ekranów przed programowaniem",
      "program na Windows z lokalną bazą danych",
      "eksport danych do plików",
      "instalator i instrukcja obsługi",
      "poprawki po pierwszych tygodniach używania",
    ],
    process: [
      {
        title: "Opis zadania",
        description:
          "Pokażesz mi, jak dziś wykonujesz zadanie i gdzie tracisz najwięcej czasu.",
      },
      {
        title: "Projekt ekranów",
        description:
          "Zaprojektuję ekrany programu. Zatwierdzisz je, zanim zacznę pisać kod.",
      },
      {
        title: "Wersje testowe",
        description:
          "Dostaniesz kolejne wersje do sprawdzenia na swoim komputerze i zgłosisz uwagi.",
      },
      {
        title: "Instalacja",
        description:
          "Przygotuję instalator, pomogę uruchomić program i pokażę, jak z niego korzystać.",
      },
    ],
    faq: [
      {
        question: "Kiedy lepszy jest program na Windows, a kiedy aplikacja w przeglądarce?",
        answer:
          "Program na Windows wybierz, gdy dane mają zostać na komputerze, potrzebujesz pracy bez internetu albo dostępu do plików i urządzeń. Aplikacja w przeglądarce sprawdzi się, gdy z danych korzysta kilka osób w różnych miejscach.",
      },
      {
        question: "W jakiej technologii piszesz programy?",
        answer:
          "Najczęściej w C# i .NET z interfejsem WPF oraz lokalną bazą SQLite. Dobieram technologię do zadania i komputerów, na których program ma działać.",
      },
      {
        question: "Czy program może łączyć się z internetem?",
        answer:
          "Tak, jeśli to potrzebne: może pobierać dane z serwisu, synchronizować je z bazą w chmurze albo wysyłać raporty.",
      },
      {
        question: "Ile kosztuje program na Windows?",
        answer:
          "Cena zależy od liczby ekranów, rodzajów danych i połączeń z innymi systemami. Po rozmowie dostaniesz zakres i dokładną wycenę netto.",
      },
      {
        question: "Na jakich komputerach zadziała program?",
        answer:
          "Na aktualnych wersjach Windows 10 i 11. Przed startem sprawdzimy komputery, na których program ma działać, i ewentualne wymagania sprzętowe.",
      },
      {
        question: "Jak instalować aktualizacje programu?",
        answer:
          "Dostaniesz nową wersję instalatora albo, jeśli to potrzebne, program będzie sam sprawdzał dostępność aktualizacji.",
      },
      {
        question: "Czy mogę przenieść dane z obecnego programu lub arkusza?",
        answer:
          "Tak, jeśli dane da się wyeksportować do pliku, na przykład CSV lub Excel. Przed importem sprawdzę ich strukturę i poprawność.",
      },
    ],
    related: [
      { href: "/bazy-danych-i-panele", label: "Bazy danych i panele" },
      { href: "/tworzenie-aplikacji-webowych", label: "Aplikacje webowe" },
      { href: "/poradniki/program-na-windows-czy-aplikacja-webowa", label: "Poradnik: program czy aplikacja webowa?" },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}

export const coreServicePages = servicePages.filter(
  (page) => page.slug !== "tworzenie-stron-internetowych-rzeszow",
);
