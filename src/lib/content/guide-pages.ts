import type { FaqItem } from "@/lib/content/service-pages";

export interface GuidePageData {
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  directAnswer: string;
  sections: Array<{ title: string; paragraphs: string[]; points?: string[] }>;
  faq: FaqItem[];
  related: Array<{ href: string; label: string }>;
  /** ISO date of the last content update. */
  updated: string;
}

export const guidePages: GuidePageData[] = [
  {
    slug: "ile-kosztuje-strona-internetowa-2026",
    path: "/poradniki/ile-kosztuje-strona-internetowa-2026",
    metaTitle: "Ile kosztuje strona internetowa w 2026 roku?",
    metaDescription: "Sprawdź, od czego zależy cena strony internetowej w 2026 roku, jakie elementy obejmuje wycena i jak przygotować zakres bez ukrytych kosztów.",
    eyebrow: "Koszt projektu bez zgadywania",
    title: "Ile kosztuje strona internetowa w 2026 roku?",
    lead: "Cena strony nie wynika wyłącznie z liczby podstron. Największy wpływ mają treść, funkcje, sposób edycji, integracje oraz odpowiedzialność za projekt i wdrożenie.",
    directAnswer: "Prosta strona firmowa w moim kalkulatorze zaczyna się od 600 zł. Jest to punkt startowy dla niewielkiego zakresu, a nie uniwersalna cena końcowa. Projekt z CMS, dodatkowymi formularzami, rozbudowaną treścią, animacjami, integracjami albo indywidualnym panelem kosztuje więcej, ponieważ wymaga dodatkowego projektu, kodu i testów.",
    sections: [
      {
        title: "Co realnie wpływa na cenę strony?",
        paragraphs: ["Najpierw ustalam, co użytkownik ma zrobić na stronie i jakie informacje są potrzebne do podjęcia decyzji. Dopiero z tej ścieżki wynika liczba widoków, sekcji i funkcji.", "Dwie strony z taką samą liczbą podstron mogą mieć zupełnie inny koszt. Jedna korzysta z gotowych treści i prostego formularza, druga wymaga strategii informacji, panelu edycji, integracji z CRM oraz kilku wersji językowych."],
        points: ["zakres projektu UX/UI i liczba unikalnych widoków", "przygotowanie lub uporządkowanie treści", "CMS, logowanie, płatności i integracje API", "liczba formularzy, automatyzacji oraz wiadomości", "migracja danych i przekierowania ze starej strony", "testy dostępności, wydajności i bezpieczeństwa"],
      },
      {
        title: "Co powinno znaleźć się w dobrej wycenie?",
        paragraphs: ["Wycena powinna opisywać rezultat, zakres oraz granice odpowiedzialności. Sama pozycja „strona internetowa” nie wyjaśnia, czy cena obejmuje projekt, wersję mobilną, treści, analitykę, domenę i wsparcie po publikacji."],
        points: ["lista widoków i funkcji", "zakres wersji mobilnej oraz dostępności", "sposób edycji treści", "integracje i usługi zewnętrzne", "testy, publikacja i okres poprawek", "koszty cykliczne hostingu, domeny lub operatorów"],
      },
      {
        title: "Jak ograniczyć koszt bez obniżania jakości?",
        paragraphs: ["Najlepszym sposobem jest podział na wersję pierwszą i dalszy rozwój. Pierwsze wdrożenie powinno zawierać wszystko, co potrzebne do realizacji najważniejszego celu, ale nie każdą funkcję, która może kiedyś się przydać.", "Pomaga również dostarczenie uporządkowanych treści, zdjęć i decyzji po jednej stronie klienta. Mniej niejasności oznacza mniej powrotów do już zatwierdzonych etapów."],
      },
      {
        title: "Cena wykonania a koszt utrzymania",
        paragraphs: ["Poza jednorazowym wykonaniem należy uwzględnić domenę, hosting, pocztę, płatne usługi zewnętrzne oraz aktualizacje. Dla statycznej strony koszty utrzymania mogą być bardzo niskie. Aplikacja z bazą, wiadomościami i płatnościami wymaga większej infrastruktury oraz monitorowania."],
      },
    ],
    faq: [
      { question: "Czy 600 zł to końcowa cena każdej strony?", answer: "Nie. To punkt startowy najprostszego zakresu w kalkulatorze. Dokładna cena powstaje po ustaleniu treści, liczby widoków, funkcji, integracji i sposobu wdrożenia." },
      { question: "Czy domena i hosting są w cenie?", answer: "Konfiguracja może być częścią realizacji, ale opłaty operatora domeny i hostingu są kosztami właściciela strony. Przed rozpoczęciem wskazuję, które koszty będą jednorazowe, a które cykliczne." },
      { question: "Czy przygotowanie treści zwiększa cenę?", answer: "Tak, jeżeli zakres obejmuje analizę, napisanie lub rozbudowane redagowanie treści. Dostarczenie gotowych, uporządkowanych materiałów skraca pracę." },
      { question: "Czy CMS jest zawsze potrzebny?", answer: "Nie. CMS ma sens, gdy treść będzie regularnie zmieniana przez właściciela. Prosta i rzadko aktualizowana strona może działać bez panelu, co ogranicza koszt oraz powierzchnię utrzymania." },
      { question: "Czy SEO jest osobno płatne?", answer: "Techniczne podstawy SEO są częścią poprawnego wdrożenia. Rozbudowana strategia treści, regularne artykuły, analiza konkurencji i pozyskiwanie wzmianek to osobny, ciągły zakres." },
      { question: "Czy mogę rozwijać stronę etapami?", answer: "Tak. Dobrze zaplanowana wersja pierwsza może zostać rozbudowana o kolejne podstrony, funkcje, języki lub integracje, gdy pojawi się realna potrzeba." },
    ],
    related: [
      { href: "/tworzenie-stron-internetowych", label: "Tworzenie stron internetowych" },
      { href: "/poradniki/ile-trwa-tworzenie-strony-internetowej", label: "Ile trwa realizacja?" },
      { href: "/#kontakt", label: "Poproś o wycenę" },
    ],
    updated: "2026-08-01",
  },
  {
    slug: "nextjs-czy-wordpress",
    path: "/poradniki/nextjs-czy-wordpress",
    metaTitle: "Next.js czy WordPress — co wybrać dla firmy?",
    metaDescription: "Praktyczne porównanie Next.js i WordPressa: koszt, edycja treści, wydajność, bezpieczeństwo, integracje i dopasowanie do rodzaju projektu.",
    eyebrow: "Narzędzie dobierane do celu",
    title: "Next.js czy WordPress — co wybrać dla strony firmowej?",
    lead: "Nie ma technologii najlepszej dla każdego projektu. WordPress i Next.js rozwiązują część podobnych problemów, ale różnią się sposobem budowy, edycji i utrzymania.",
    directAnswer: "WordPress jest rozsądnym wyborem, gdy najważniejsza jest częsta samodzielna edycja standardowych treści i można oprzeć projekt na dojrzałym ekosystemie CMS. Next.js lepiej pasuje do indywidualnego interfejsu, aplikacji, nietypowych integracji oraz sytuacji, w których kod produktu ma rosnąć razem z wymaganiami. Decyzję należy oprzeć na funkcjach i utrzymaniu, nie na samej popularności technologii.",
    sections: [
      { title: "Kiedy wybrać WordPress?", paragraphs: ["WordPress dobrze sprawdza się w serwisach treściowych, blogach i typowych stronach firmowych, gdy redaktor potrzebuje znanego panelu oraz gotowych rozszerzeń.", "Trzeba jednak kontrolować jakość motywu i wtyczek, aktualizacje oraz uprawnienia. Duża liczba przypadkowych dodatków może utrudnić wydajność i bezpieczeństwo."], points: ["regularna samodzielna publikacja treści", "standardowa strona lub blog", "zespół zna już panel WordPress", "funkcje są dostępne w dobrze utrzymanych rozszerzeniach"] },
      { title: "Kiedy wybrać Next.js?", paragraphs: ["Next.js jest dobrym wyborem dla indywidualnych produktów, paneli i serwisów wymagających ścisłej kontroli interfejsu, danych oraz renderowania. Pozwala połączyć część serwerową i frontend w jednym projekcie TypeScript.", "Treści nadal mogą być edytowane przez CMS — Next.js nie oznacza rezygnacji z panelu. CMS może działać jako osobna, kontrolowana warstwa danych."], points: ["niestandardowe funkcje i przepływy użytkownika", "integracje z API, bazą i logowaniem", "wysoka kontrola wydajności oraz kodu", "planowany rozwój w kierunku aplikacji webowej"] },
      { title: "Wydajność i SEO", paragraphs: ["Obie technologie mogą osiągać dobre wyniki SEO i Core Web Vitals. O rezultacie decydują implementacja, treść, obrazy, hosting oraz liczba skryptów, a nie sama etykieta frameworka.", "Next.js udostępnia renderowanie serwerowe, statyczne strony, metadane i optymalizację zasobów. WordPress ma dojrzałe narzędzia redakcyjne oraz wtyczki SEO, ale wymaga kontroli motywu i dodatków." ] },
      { title: "Bezpieczeństwo i utrzymanie", paragraphs: ["Każdy system wymaga aktualizacji i dobrych praktyk. W WordPressie szczególne znaczenie ma aktualność rdzenia, motywu i wtyczek. W Next.js trzeba aktualizować zależności, chronić serwerowe operacje i poprawnie zarządzać sekretami oraz autoryzacją.", "Najbezpieczniejszy jest nie ten system, który ma lepszą opinię, lecz ten, którego zakres jest ograniczony, zależności kontrolowane, a proces aktualizacji faktycznie wykonywany."] },
    ],
    faq: [
      { question: "Czy Next.js jest lepszy od WordPressa?", answer: "Nie w każdym projekcie. Next.js daje większą swobodę kodu i integracji, a WordPress szybszy dostęp do dojrzałego CMS oraz typowych funkcji treściowych." },
      { question: "Czy Next.js może mieć panel do edycji treści?", answer: "Tak. Można połączyć go z własnym panelem lub zewnętrznym headless CMS, dzięki czemu redaktor edytuje treść bez zmiany kodu." },
      { question: "Które rozwiązanie jest tańsze?", answer: "Dla prostej strony opartej na dobrym gotowym zakresie WordPress może być tańszy na start. Przy nietypowych funkcjach koszt wielu rozszerzeń i ich utrzymania może zmienić to porównanie." },
      { question: "Które rozwiązanie jest szybsze?", answer: "Oba mogą być szybkie. Next.js ułatwia precyzyjną kontrolę renderowania, ale źle zbudowana aplikacja także będzie wolna. W WordPressie kluczowe są motyw, wtyczki, cache i hosting." },
      { question: "Które rozwiązanie jest bezpieczniejsze?", answer: "Bezpieczeństwo zależy od implementacji i utrzymania. WordPress wymaga kontroli wtyczek i aktualizacji, a Next.js poprawnej walidacji, autoryzacji, aktualnych zależności i ochrony sekretów." },
      { question: "Czy można przenieść WordPressa do Next.js?", answer: "Tak. Można zachować WordPress jako headless CMS albo przenieść treść do innego systemu. Migracja wymaga mapy adresów, zachowania SEO, obrazów i przekierowań." },
    ],
    related: [
      { href: "/nextjs-developer", label: "Usługi Next.js" },
      { href: "/tworzenie-stron-internetowych", label: "Tworzenie stron" },
      { href: "/poradniki/ile-kosztuje-strona-internetowa-2026", label: "Koszt strony w 2026" },
    ],
    updated: "2026-08-01",
  },
  {
    slug: "ile-trwa-tworzenie-strony-internetowej",
    path: "/poradniki/ile-trwa-tworzenie-strony-internetowej",
    metaTitle: "Ile trwa tworzenie strony internetowej?",
    metaDescription: "Dowiedz się, ile trwa wykonanie strony firmowej, co wpływa na termin i jak przygotować materiały, aby projekt przebiegał sprawnie.",
    eyebrow: "Realny harmonogram projektu",
    title: "Ile trwa stworzenie strony internetowej?",
    lead: "Termin zależy bardziej od zakresu, treści i szybkości decyzji niż od samego pisania kodu. Mała strona może powstać szybko, a rozbudowany serwis wymaga analizy, iteracji i testów.",
    directAnswer: "Prosta strona firmowa zwykle wymaga około 1–3 tygodni pracy od potwierdzenia zakresu i otrzymania materiałów. Rozbudowany serwis, sklep albo aplikacja może zająć od kilku tygodni do kilku miesięcy. Dokładny termin ustalam dopiero po podziale projektu na widoki, funkcje, treści, integracje i etapy akceptacji.",
    sections: [
      { title: "Jak wygląda typowy harmonogram?", paragraphs: ["Projekt zaczyna się od krótkiej analizy celu, odbiorców i materiałów. Następnie powstaje struktura informacji, kierunek wizualny, wdrożenie, testy i publikacja.", "Etapy mogą częściowo nakładać się na siebie, ale nie warto zaczynać finalnego interfejsu bez podstawowych treści. Projektowanie na tekście zastępczym często kończy się przebudową sekcji."], points: ["analiza i zakres: 1–3 dni robocze", "struktura i kierunek wizualny: kilka dni", "wdrożenie: zależnie od liczby widoków i funkcji", "testy, poprawki i publikacja: zwykle kilka dni"] },
      { title: "Co najczęściej opóźnia projekt?", paragraphs: ["Największe opóźnienia zwykle nie wynikają z technologii. Powstają wtedy, gdy brakuje treści, nie ma jednej osoby decyzyjnej albo w trakcie realizacji zmienia się cel i zakres."], points: ["brak tekstów, zdjęć lub danych firmowych", "wiele sprzecznych osób akceptujących", "nowe funkcje dodawane bez aktualizacji terminu", "oczekiwanie na dostęp do domeny i usług", "zewnętrzne integracje bez dokumentacji lub kont testowych"] },
      { title: "Jak przyspieszyć realizację?", paragraphs: ["Przed startem warto przygotować ofertę, dane kontaktowe, identyfikację, przykłady estetyki i osobę odpowiedzialną za decyzje. Nie muszą to być idealne materiały — ważne, aby były kompletne i możliwe do oceny.", "Pomaga także akceptowanie projektu etapami. Zatwierdzona struktura, następnie styl i dopiero kolejne widoki ograniczają powrót do podstawowych decyzji pod koniec pracy." ] },
      { title: "Czy szybciej zawsze znaczy lepiej?", paragraphs: ["Nie. Bardzo krótki termin może wymusić ograniczenie zakresu, użycie gotowych rozwiązań lub równoległe podejmowanie decyzji. Jeżeli data publikacji jest sztywna, uczciwym rozwiązaniem jest mniejsza wersja pierwsza i rozwój po uruchomieniu." ] },
    ],
    faq: [
      { question: "Czy strona może powstać w tydzień?", answer: "Tak, jeśli zakres jest niewielki, treści są gotowe, decyzje szybkie, a potrzebne funkcje standardowe. Termin musi obejmować także testy i publikację." },
      { question: "Od kiedy liczy się termin realizacji?", answer: "Od potwierdzenia zakresu, dostarczenia niezbędnych materiałów i spełnienia ustalonych warunków rozpoczęcia. Samo pierwsze zapytanie nie uruchamia harmonogramu." },
      { question: "Czy przygotowanie tekstów jest częścią terminu?", answer: "Tak, jeśli teksty powstają w ramach zlecenia. Gdy dostarcza je klient, harmonogram zakłada konkretną datę ich przekazania." },
      { question: "Ile trwa stworzenie sklepu internetowego?", answer: "Zwykle dłużej niż strony firmowej, ponieważ trzeba przygotować produkty, warianty, płatności, dostawę, wiadomości, dokumenty i testy zamówień. Dokładny czas zależy od modelu sprzedaży." },
      { question: "Czy poprawki wydłużają termin?", answer: "Uzgodniona liczba rund poprawek jest częścią harmonogramu. Zmiana zaakceptowanego kierunku albo dodanie nowego zakresu wymaga aktualizacji terminu." },
      { question: "Co muszę przygotować przed startem?", answer: "Opis firmy, ofertę, cel strony, dane kontaktowe, logo i zdjęcia, jeśli są dostępne. Przydatne są też przykłady stron oraz wskazanie jednej osoby podejmującej decyzje." },
    ],
    related: [
      { href: "/tworzenie-stron-internetowych", label: "Tworzenie stron internetowych" },
      { href: "/poradniki/ile-kosztuje-strona-internetowa-2026", label: "Ile kosztuje strona?" },
      { href: "/#kontakt", label: "Zapytaj o termin" },
    ],
    updated: "2026-08-01",
  },
  {
    slug: "arkusz-czy-wlasna-aplikacja",
    path: "/poradniki/arkusz-czy-wlasna-aplikacja",
    metaTitle: "Arkusz Excel czy własna aplikacja? Kiedy zmienić narzędzie",
    metaDescription: "Sprawdź, po czym poznać, że arkusz przestaje wystarczać firmie, co daje własna baza danych z panelem i jak przejść na nią bez utraty danych.",
    eyebrow: "Dane firmy pod kontrolą",
    title: "Arkusz czy własna aplikacja — kiedy warto zmienić narzędzie?",
    lead: "Arkusz to świetny start: jest pod ręką, nic nie kosztuje i każdy umie go otworzyć. Problemy zaczynają się, gdy korzysta z niego kilka osób, danych przybywa, a jedna pomyłka psuje raport na cały miesiąc.",
    directAnswer: "Arkusz wystarczy, gdy dane wpisuje jedna osoba, rekordów jest niewiele, a pomyłka nie ma poważnych skutków. Własna aplikacja z bazą danych ma sens, gdy te same informacje przepisujesz w kilka miejsc, kilka osób edytuje plik jednocześnie, potrzebujesz różnych uprawnień albo tracisz czas na szukanie i ręczne liczenie. Nie trzeba zmieniać wszystkiego naraz: zwykle zaczyna się od jednej listy, na przykład zamówień lub klientów.",
    sections: [
      {
        title: "Sygnały, że arkusz przestaje wystarczać",
        paragraphs: ["Najczęściej nie chodzi o samą liczbę wierszy, tylko o sposób pracy. Gdy kilka osób ma własne kopie pliku, nikt nie wie, która wersja jest aktualna. Gdy dane trafiają do arkusza z maili i formularzy, ktoś musi je ręcznie przepisywać.", "Warto przyjrzeć się, ile czasu tygodniowo zajmuje utrzymanie arkusza i ile kosztuje pomyłka: zgubione zamówienie, zła cena w ofercie albo podwójna rezerwacja."],
        points: ["kilka wersji tego samego pliku", "przepisywanie danych z maili i formularzy", "brak kontroli, kto co zmienił", "formuły, których nikt poza autorem nie rozumie", "raporty liczone ręcznie co tydzień lub miesiąc", "dane klientów dostępne dla każdego, kto ma plik"],
      },
      {
        title: "Co daje baza danych z panelem",
        paragraphs: ["Baza danych przechowuje informacje w uporządkowanej strukturze: każdy klient, zamówienie czy produkt ma swoje pola i powiązania. Panel to ekran, na którym te dane przeglądasz, wyszukujesz i zmieniasz bez znajomości programowania.", "Do tego dochodzą role użytkowników, historia zmian, walidacja danych przy wpisywaniu oraz eksport do arkusza, gdy chcesz coś przeanalizować po swojemu."],
      },
      {
        title: "Gotowe narzędzie czy aplikacja na zamówienie?",
        paragraphs: ["Jeśli Twój proces jest typowy, gotowy system (CRM, program magazynowy, system rezerwacji) może wystarczyć i będzie tańszy na start. Warto go sprawdzić przed zamówieniem własnej aplikacji.", "Aplikacja na zamówienie ma sens, gdy gotowe narzędzia wymuszają zmianę sposobu pracy, płacisz za wiele funkcji, z których nie korzystasz, albo potrzebujesz połączenia kilku procesów w jednym miejscu."],
      },
      {
        title: "Jak przejść z arkusza bez utraty danych",
        paragraphs: ["Najpierw porządkuje się istniejące dane: usuwa duplikaty, ujednolica formaty dat i nazw, ustala, które kolumny są potrzebne. Potem powstaje struktura bazy i import z pliku.", "Przez krótki czas warto prowadzić oba narzędzia równolegle i porównać wyniki. Dopiero gdy panel sprawdzi się w codziennej pracy, arkusz staje się kopią do analiz, a nie głównym źródłem danych."],
        points: ["porządkowanie i ujednolicenie danych", "projekt struktury bazy", "import z arkusza i sprawdzenie wyników", "krótki okres pracy równoległej", "eksport do arkusza na potrzeby analiz"],
      },
    ],
    faq: [
      { question: "Czy muszę całkowicie zrezygnować z Excela?", answer: "Nie. Panel może eksportować dane do arkusza, więc możesz dalej robić w nim analizy. Zmienia się tylko to, gdzie dane są wpisywane i przechowywane." },
      { question: "Ile danych to za dużo dla arkusza?", answer: "Nie ma jednej granicy. O zmianie częściej decyduje liczba osób pracujących na pliku, liczba powiązanych arkuszy i koszt pomyłek niż sama liczba wierszy." },
      { question: "Czy mogę zacząć od jednej funkcji?", answer: "Tak. Najczęściej zaczyna się od jednej listy, na przykład zamówień, klientów albo zgłoszeń. Kolejne elementy dodaje się, gdy pierwsza część sprawdzi się w codziennej pracy." },
      { question: "Czy aplikacja będzie działać na telefonie?", answer: "Aplikacja w przeglądarce może działać na komputerze, tablecie i telefonie. Ekrany projektuje się pod zadania, które naprawdę wykonujesz w terenie." },
      { question: "Kto będzie miał dostęp do danych?", answer: "Ustalasz to Ty. Każda osoba dostaje konto z rolą, która określa, co może przeglądać, a co zmieniać." },
      { question: "Co, jeśli dane w arkuszu są nieuporządkowane?", answer: "To normalne. Porządkowanie danych jest częścią przejścia na bazę i warto je wykonać przed importem, żeby nowy system nie przejął starych błędów." },
    ],
    related: [
      { href: "/bazy-danych-i-panele", label: "Bazy danych i panele" },
      { href: "/tworzenie-aplikacji-webowych", label: "Aplikacje webowe" },
      { href: "/#kontakt", label: "Opisz swoje dane" },
    ],
    updated: "2026-11-14",
  },
  {
    slug: "program-na-windows-czy-aplikacja-webowa",
    path: "/poradniki/program-na-windows-czy-aplikacja-webowa",
    metaTitle: "Program na Windows czy aplikacja w przeglądarce? Jak wybrać",
    metaDescription: "Porównanie programu na Windows i aplikacji webowej: dostęp z wielu miejsc, praca bez internetu, dane na miejscu, aktualizacje i koszty utrzymania.",
    eyebrow: "Wybór rodzaju aplikacji",
    title: "Program na Windows czy aplikacja w przeglądarce?",
    lead: "Oba rozwiązania mogą robić to samo: przechowywać dane, liczyć, generować raporty. Różnią się tym, gdzie działają, kto ma do nich dostęp i jak się je aktualizuje.",
    directAnswer: "Aplikacja w przeglądarce sprawdzi się, gdy z danych korzysta kilka osób w różnych miejscach, potrzebny jest dostęp z telefonu albo dane mają być wspólne dla całego zespołu. Program na Windows lepiej pasuje, gdy dane mają zostać na komputerze w firmie, praca musi być możliwa bez internetu albo program łączy się z plikami i urządzeniami na miejscu. Często da się połączyć oba podejścia: program pracuje lokalnie i synchronizuje wybrane dane z bazą w chmurze.",
    sections: [
      {
        title: "Kiedy wybrać aplikację w przeglądarce",
        paragraphs: ["Aplikację webową otwierasz w przeglądarce na dowolnym urządzeniu. Nie trzeba jej instalować, a nowa wersja jest dostępna dla wszystkich od razu po wdrożeniu.", "To dobry wybór dla zespołu, który pracuje w różnych miejscach, dla klientów, którzy mają coś zamówić lub zarezerwować, oraz wszędzie tam, gdzie dane muszą być wspólne i aktualne."],
        points: ["kilka osób w różnych miejscach", "dostęp z telefonu i tabletu", "klienci korzystają z aplikacji samodzielnie", "jedna wspólna baza danych", "aktualizacje bez instalowania"],
      },
      {
        title: "Kiedy wybrać program na Windows",
        paragraphs: ["Program instalowany na komputerze działa niezależnie od połączenia z internetem i może przechowywać dane lokalnie. Ma też łatwiejszy dostęp do plików na dysku i urządzeń podłączonych do komputera.", "Sprawdza się przy stanowiskach pracy w firmie, analizie dużych plików, pracy w miejscach bez stabilnego internetu i tam, gdzie dane nie powinny opuszczać budynku."],
        points: ["praca bez internetu", "dane zostają na komputerze", "dostęp do plików i urządzeń", "jedno stanowisko lub kilka komputerów w firmie", "przetwarzanie dużych plików na miejscu"],
      },
      {
        title: "Aktualizacje i utrzymanie",
        paragraphs: ["Aplikację webową aktualizuje się w jednym miejscu, na serwerze. Wymaga za to hostingu i bazy w chmurze, co oznacza stały, zwykle niewielki koszt miesięczny.", "Program na Windows nie potrzebuje serwera, ale każdą nową wersję trzeba zainstalować na komputerach. Można to uprościć instalatorem albo automatycznym sprawdzaniem aktualizacji."],
      },
      {
        title: "Rozwiązanie mieszane",
        paragraphs: ["Nie zawsze trzeba wybierać. Program na Windows może pracować lokalnie, a wybrane dane, na przykład raporty lub zamówienia, wysyłać do bazy w chmurze, z której korzysta aplikacja w przeglądarce.", "Takie połączenie zwiększa zakres projektu, dlatego warto zacząć od jednej części i dodać drugą, gdy pierwsza sprawdzi się w praktyce."],
      },
    ],
    faq: [
      { question: "Co jest tańsze: program czy aplikacja webowa?", answer: "To zależy od zakresu, a nie od rodzaju. Aplikacja webowa ma stały koszt hostingu, program na Windows koszt dystrybucji aktualizacji. Przy podobnych funkcjach koszt wykonania bywa zbliżony." },
      { question: "Czy program na Windows może działać na Macu?", answer: "Program napisany pod Windows nie uruchomi się bezpośrednio na macOS. Jeśli w firmie są różne systemy, zwykle lepszym wyborem jest aplikacja w przeglądarce." },
      { question: "Czy aplikacja webowa działa bez internetu?", answer: "W ograniczonym zakresie. Można przygotować tryb offline dla wybranych ekranów, ale pełna praca bez połączenia jest naturalną zaletą programu instalowanego na komputerze." },
      { question: "Gdzie są bezpieczniejsze dane?", answer: "Bezpieczeństwo zależy od wykonania i utrzymania. Dane lokalne trzeba chronić kopiami zapasowymi i dostępem do komputera, dane w chmurze — kontrolą uprawnień, szyfrowaniem połączenia i kopiami po stronie serwera." },
      { question: "W jakiej technologii piszesz programy na Windows?", answer: "Najczęściej w C# i .NET z interfejsem WPF i lokalną bazą SQLite. Aplikacje webowe buduję w Next.js, React i TypeScript." },
      { question: "Czy można później przenieść program do przeglądarki?", answer: "Tak, ale zwykle oznacza to przebudowę interfejsu. Dobrze zaprojektowana struktura danych i logika ułatwiają takie przejście." },
    ],
    related: [
      { href: "/programy-na-windows", label: "Programy na Windows" },
      { href: "/tworzenie-aplikacji-webowych", label: "Aplikacje webowe" },
      { href: "/poradniki/arkusz-czy-wlasna-aplikacja", label: "Arkusz czy aplikacja?" },
    ],
    updated: "2026-11-14",
  },
  {
    slug: "ile-kosztuje-sklep-internetowy-2026",
    path: "/poradniki/ile-kosztuje-sklep-internetowy-2026",
    metaTitle: "Ile kosztuje sklep internetowy w 2026 roku?",
    metaDescription: "Od czego zależy cena sklepu internetowego: katalog, koszyk, płatności, dostawa i panel zamówień. Co obejmuje wycena i jakie są koszty po starcie.",
    eyebrow: "Sklep bez ukrytych kosztów",
    title: "Ile kosztuje sklep internetowy w 2026 roku?",
    lead: "Cena sklepu wynika z tego, ile produktów sprzedajesz, jak klient płaci i odbiera zamówienie oraz jak chcesz obsługiwać zamówienia na co dzień.",
    directAnswer: "Prosty sklep z katalogiem produktów, koszykiem i panelem zamówień zaczyna się w moim kalkulatorze od 1800 zł netto. To punkt startowy dla niewielkiego katalogu i jednej, prostej ścieżki zakupu. Więcej kosztują między innymi integracje z hurtownią lub programem magazynowym, warianty produktów, kilka metod dostawy z różnymi zasadami, rabaty i import dużej liczby produktów.",
    sections: [
      {
        title: "Co składa się na sklep internetowy?",
        paragraphs: ["Klient widzi katalog, kartę produktu, koszyk i formularz zamówienia. Ty pracujesz w panelu: dodajesz produkty, zmieniasz ceny i stany, sprawdzasz zamówienia i odpowiadasz klientom.", "Obie strony są równie ważne. Ładny katalog nie pomoże, jeśli obsługa zamówień zajmuje Ci więcej czasu niż wcześniej."],
        points: ["katalog z wyszukiwaniem i filtrami", "karta produktu ze zdjęciami, opisem i wariantami", "koszyk i zamówienie bez zbędnych kroków", "płatności online i wybrane metody dostawy", "panel produktów, zamówień i klientów", "wiadomości do klienta po złożeniu zamówienia"],
      },
      {
        title: "Co najbardziej wpływa na cenę?",
        paragraphs: ["Najwięcej pracy zwykle nie wymaga sam wygląd, tylko zasady: jak liczy się koszt dostawy, kiedy produkt jest niedostępny, jak działają rabaty i skąd biorą się dane o produktach.", "Dlatego przed wyceną pytam o liczbę produktów, warianty (rozmiary, kolory, gramatury), metody płatności i dostawy oraz to, czy dane mają przychodzić z innego systemu."],
        points: ["liczba produktów i wariantów", "import produktów z pliku lub z hurtowni", "integracje z płatnościami, kurierem lub programem magazynowym", "rabaty, kody promocyjne i ceny dla firm", "kilka języków lub walut", "przeniesienie danych i adresów ze starego sklepu"],
      },
      {
        title: "Koszty po uruchomieniu",
        paragraphs: ["Poza jednorazowym wykonaniem sklep ma koszty stałe: domenę, hosting z bazą danych, pocztę oraz prowizje operatora płatności i firm kurierskich. Ich wysokość zależy od wybranych usług i liczby zamówień, dlatego przed startem rozpisuję, które koszty są jednorazowe, a które miesięczne.", "Warto też zaplanować czas na pierwsze tygodnie: poprawki po pierwszych zamówieniach i drobne zmiany, które wychodzą dopiero przy prawdziwym ruchu."],
      },
      {
        title: "Jak zacząć taniej?",
        paragraphs: ["Najrozsądniej jest uruchomić sklep z tym, co naprawdę sprzedajesz najczęściej, i z jedną lub dwiema metodami płatności i dostawy. Kolejne funkcje dodasz, gdy zobaczysz, czego potrzebują klienci.", "Dobrze zaprojektowana pierwsza wersja nie wymaga przebudowy przy rozwoju. Integracje, rabaty czy nowe kategorie można dołożyć później."],
      },
    ],
    faq: [
      { question: "Czy 1800 zł netto to cena końcowa każdego sklepu?", answer: "Nie. To punkt startowy najprostszego zakresu w kalkulatorze. Dokładną cenę dostaniesz po ustaleniu liczby produktów, płatności, dostaw i integracji." },
      { question: "Czy mogę sam dodawać produkty?", answer: "Tak. Sklep ma panel, w którym dodajesz i edytujesz produkty, ceny, stany i zdjęcia bez pisania do programisty." },
      { question: "Jakie płatności można podłączyć?", answer: "Popularne bramki płatności online, BLIK, przelew tradycyjny i płatność przy odbiorze. Wybór zależy od Twoich klientów i kosztów prowizji, dlatego ustalamy go razem." },
      { question: "Czy przeniesiesz produkty ze starego sklepu?", answer: "Tak, jeśli da się je wyeksportować (np. do pliku CSV). Przeniesienie danych i przekierowanie starych adresów wyceniam osobno, bo zależy od ich jakości i liczby." },
      { question: "Czy sklep będzie działał na telefonie?", answer: "Tak. Katalog, koszyk i zamówienie projektuję najpierw z myślą o telefonie, bo tam klienci najczęściej przeglądają produkty." },
      { question: "Ile trwa zrobienie sklepu?", answer: "Termin zależy głównie od gotowości zdjęć i opisów produktów oraz od liczby integracji. Dokładny harmonogram dostaniesz razem z wyceną." },
    ],
    related: [
      { href: "/sklepy-internetowe", label: "Sklepy internetowe" },
      { href: "/poradniki/jak-przygotowac-sie-do-wyceny", label: "Jak przygotować się do wyceny?" },
      { href: "/#kontakt", label: "Poproś o wycenę sklepu" },
    ],
    updated: "2026-11-15",
  },
  {
    slug: "jak-przygotowac-sie-do-wyceny",
    path: "/poradniki/jak-przygotowac-sie-do-wyceny",
    metaTitle: "Jak przygotować się do wyceny strony lub aplikacji?",
    metaDescription: "Siedem rzeczy, które warto napisać w pierwszej wiadomości, żeby szybko dostać konkretną wycenę strony, sklepu, aplikacji lub programu.",
    eyebrow: "Pierwsza wiadomość",
    title: "Jak przygotować się do wyceny strony lub aplikacji?",
    lead: "Nie musisz znać technologii ani pisać specyfikacji. Wystarczy kilka konkretnych zdań o Twojej firmie i o tym, co chcesz usprawnić.",
    directAnswer: "Do pierwszej wyceny wystarczy: czym zajmuje się firma, kto ma korzystać z projektu, co ma się dzięki niemu zmienić, jakie funkcje są niezbędne na start, jakie materiały już masz, jaki jest termin i orientacyjny budżet. Resztę ustalimy w krótkiej rozmowie, a potem dostaniesz zakres, cenę i harmonogram.",
    sections: [
      {
        title: "Co napisać w pierwszej wiadomości?",
        paragraphs: ["Najwięcej daje opis problemu, a nie gotowe rozwiązanie. Zdanie „klienci dzwonią z tymi samymi pytaniami” mówi więcej niż „potrzebuję strony z pięcioma podstronami”."],
        points: ["czym zajmuje się Twoja firma i dla kogo pracujesz", "co ma się zmienić po uruchomieniu (więcej zapytań, mniej telefonów, porządek w danych)", "kto będzie korzystał: klienci, pracownicy, tylko Ty", "funkcje niezbędne na start, a które mogą poczekać", "materiały, które już są: teksty, zdjęcia, logo, arkusze z danymi", "termin, na który projekt jest potrzebny", "orientacyjny budżet, nawet przedziałem"],
      },
      {
        title: "Dlaczego warto podać budżet?",
        paragraphs: ["Ten sam cel można osiągnąć na kilka sposobów. Znając budżet, mogę zaproponować wersję, która mieści się w kwocie, i powiedzieć wprost, co zostawić na później. Bez niego obie strony zgadują.", "Podanie budżetu nie oznacza, że wycena go „wypełni”. Jeśli zakres da się zrobić taniej, dostaniesz niższą cenę."],
      },
      {
        title: "Co będzie po wysłaniu wiadomości?",
        paragraphs: ["Najpierw krótka rozmowa, w której dopytam o szczegóły. Potem dostaniesz propozycję zakresu, cenę i termin. Decyzję podejmujesz dopiero wtedy, a do tego momentu nie płacisz za nic.", "Jeśli lepszym rozwiązaniem okaże się coś innego niż to, o co pytasz, na przykład arkusz zamiast aplikacji, powiem Ci o tym."],
      },
      {
        title: "Przykład dobrej pierwszej wiadomości",
        paragraphs: ["„Prowadzę warsztat samochodowy w Jarosławiu. Klienci dzwonią, żeby zapytać o wolne terminy, a grafik mamy w zeszycie. Chciałbym, żeby mogli sami zarezerwować wizytę, a my widzieli grafik w telefonie. Na start wystarczy rezerwacja i lista wizyt. Logo i zdjęcia mam. Zależy mi na wiośnie, budżet do kilku tysięcy złotych.”", "Taka wiadomość wystarczy, żeby przygotować sensowną propozycję albo zadać dwa, trzy precyzyjne pytania."],
      },
    ],
    faq: [
      { question: "Czy muszę wiedzieć, czy potrzebuję strony, czy aplikacji?", answer: "Nie. Opisz problem, a ja zaproponuję rozwiązanie: stronę, sklep, aplikację webową, bazę danych z panelem albo program na Windows." },
      { question: "Czy wycena jest płatna?", answer: "Nie. Rozmowa i propozycja zakresu z ceną są bezpłatne i do niczego nie zobowiązują." },
      { question: "Co, jeśli nie mam tekstów ani zdjęć?", answer: "To częsta sytuacja. Pomogę ustalić, czego potrzeba, i uwzględnię przygotowanie treści w zakresie albo wskażę, co przygotować samodzielnie." },
      { question: "Czy wycenisz projekt na podstawie przykładu innej strony?", answer: "Tak, przykład bardzo pomaga. Napisz, co Ci się w nim podoba i czego potrzebujesz inaczej, bo dwie podobnie wyglądające strony mogą mieć zupełnie inny zakres." },
      { question: "Czy po wycenie mogę zmienić zakres?", answer: "Tak. Wycena opisuje zakres, więc łatwo zobaczyć, co się zmienia. Przed zmianą ceny lub terminu zawsze dostaniesz informację, ile to kosztuje i jak wpływa na termin." },
      { question: "Jak szybko dostanę odpowiedź?", answer: "Odpowiadam osobiście, na adres podany w formularzu. Zaraz po wysłaniu dostaniesz mail z potwierdzeniem, że wiadomość dotarła." },
    ],
    related: [
      { href: "/uslugi", label: "Czego potrzebuje Twoja firma?" },
      { href: "/poradniki/ile-kosztuje-strona-internetowa-2026", label: "Ile kosztuje strona?" },
      { href: "/#kontakt", label: "Napisz wiadomość" },
    ],
    updated: "2026-11-15",
  },
];

export function getGuidePage(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}
