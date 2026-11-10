# Plan przebudowy „Premium Motion” — emanuelwloch.pl

Dokument opisuje **co zostało zmienione w kodzie**, **dlaczego**, **jak to zweryfikować** oraz **co zrobić dalej**. Wszystkie zmiany z punktów 1–9 są już wprowadzone w tej paczce.

> **Ważne — status weryfikacji.** W środowisku, w którym przygotowałem zmiany, nie było `node_modules` ani dostępu do sieci, więc **nie uruchomiłem `npm run check`** (lint, typy, testy, build). Sprawdziłem tylko składnię TS/JSX kompilatorem. Pierwszy krok po wdrożeniu to `npm install && npm run check` (patrz sekcja 10).

---

## 0. Kierunek wizualny

Strona ma już spójną paletę: grafit `#0b0d0f`, powierzchnie `#13171a`, akcent stalowy błękit `#acd1e8`, Geist + Geist Mono. Stary favicon (cyjan → fiolet) **był z nią sprzeczny**, tak samo część starszych komponentów (`ProfessionalHeroSection` itd. używają neonów `#00f0ff` / `#8b5cf6`).

Decyzja: **nie zmieniam palety — dopracowuję ją.** Premium = spokój, głębia i płynny ruch, a nie więcej kolorów.

| Element | Zasada |
|---|---|
| Kolor | Jeden akcent `#acd1e8` + pochodny `#7fb4d6`; światło jako poświata, nie jako neon |
| Ruch | Jedna krzywa wejścia (`expo.out`), jedna krzywa przejść (`expo.inOut`); czas 0,9–1,4 s |
| Głębia | Spotlight kursora, ramka-gradient, delikatny tilt 3D, ziarno 5 % |
| Ikony | Jeden zestaw: siatka 24 px, obrys 1,5, duotone, rysowanie obrysu na hover |
| Dostępność | `prefers-reduced-motion` = zero ruchu i zero ukrywania treści |

---

## 1. Wtyczka animacji: GSAP 3.15 (ScrollTrigger + SplitText)

**Dlaczego GSAP, a nie nowa paczka.** `gsap@^3.15` już jest w `package.json` i obsługuje Twoją scenę 3D (`ScrollTimeline.ts`). Od wersji 3.13 **wszystkie wtyczki, w tym SplitText, są bezpłatne** i wchodzą w skład paczki `gsap`. Dzięki temu:

- zero nowych zależności (mniejsze ryzyko, brak zmian w `package-lock.json`),
- jedna biblioteka animacji zamiast dwóch konkurujących o scroll,
- `framer-motion` zostaje tylko tam, gdzie już jest (starsze komponenty, modale).

**Nowe pliki**

| Plik | Rola |
|---|---|
| `src/lib/motion/gsap.ts` | Jedna rejestracja wtyczek, wspólne krzywe (`ease`), `ScrollTrigger.config({ ignoreMobileResize: true })` |
| `src/components/portfolio/motion/MotionLayer.tsx` | Cała choreografia strony (klient, jeden `useEffect`) |

### Co robi `MotionLayer`

1. **Intro hero** — `SplitText` dzieli `<h1>` na linie z maską; każda wjeżdża od dołu (`yPercent: 110`, stagger 0,13 s). Pozostałe elementy hero i wizualizacja 3D wchodzą po nim.
2. **Nagłówki sekcji** — ten sam efekt maskowanych linii, odtwarzany **raz** przy wejściu w widok. `autoSplit: true` ponownie dzieli tekst po zmianie szerokości/fontu, a zabezpieczenie `played` nie pozwala animacji odtworzyć się od nowa przy resize.
3. **Odsłanianie** — atrybuty w JSX, bez logiki w komponentach:
   - `data-reveal` — fade + przesunięcie,
   - `data-reveal="clip"` — odsłanianie maską z paralaksą zdjęcia (portret w „O mnie”),
   - `data-reveal="line"` — rysowanie linii,
   - `data-stagger` — dzieci kontenera wchodzą kaskadowo (karty usług, opinie, kontakt, stopka).
4. **Paralaksa i scrub** — portret, linia procesu współpracy (`.service-steps`, zmienna `--line`), pasek postępu strony.
5. **Nawigacja** — stan `is-scrolled` (szkło + cień) oraz chowanie przy scrollu w dół / pokazanie przy scrollu w górę. Menu otwarte lub fokus klawiatury = nawigacja zawsze widoczna.
6. **Wskaźnik (tylko mysz)** — delegowane zdarzenia, bez listenerów na każdej karcie:
   - **spotlight** — `--mx/--my` sterują poświatą i ramką-gradientem,
   - **tilt 3D** — `gsap.quickTo`, ±5°,
   - **magnetyczne przyciski** — przez zmienne CSS `--mag-x/--mag-y` i właściwość `translate`, więc **nie koliduje** z hoverem opartym na `transform`.
7. **Odświeżanie pozycji** — `ResizeObserver` na `body` (obrazy, `<details>`, fonty) → debounce → `ScrollTrigger.refresh()`.
8. **Nowe elementy po zmianie filtra** — `MutationObserver` + idempotentne `bind()` podpina karty dodane po montażu (inaczej CSS ukryłby je na stałe).

### Zasady bezpieczeństwa animacji (dlaczego nie będzie „pustej strony”)

- **Brak migotania:** klasa `js-motion` jest ustawiana inline-skryptem w `<head>` (layout) przed pierwszym malowaniem; CSS ukrywa tylko elementy, które JS zaraz odsłoni.
- **Failsafe:** jeśli hydracja nie ruszy w 4,5 s, skrypt zdejmuje `js-motion` i treść pojawia się bez animacji.
- **Reduced motion:** skrypt w ogóle nie ustawia `js-motion`; `gsap.matchMedia` nie tworzy żadnych animacji.
- **Sprzątanie:** `mm.revert()` usuwa triggery, SplitText i style inline (działa też z React Strict Mode).
- **Tylko tanie właściwości:** `transform`, `opacity`, `clip-path` — bez animowania układu.
- **Scena 3D nietknięta:** `ScrollTimeline.ts` i `three/*` bez zmian; `MotionLayer` animuje wyłącznie dzieci `.product-hero-copy` i `.product-visual`, a timeline steruje rodzicem.

---

## 2. Własny zestaw ikon

Plik: `src/components/portfolio/icons.tsx` (bez `"use client"` — działa w komponentach serwerowych, np. w stopce).

- **Siatka 24×24, obrys 1,5, zaokrąglone końce, duotone** (`currentColor` + `--icon-accent`).
- **Hover:** ścieżki z `data-draw` rysują się od nowa (`stroke-dashoffset`), bez JS.
- **Zestaw (24 ikony + znak marki):**
  - usługi: `IconSite`, `IconCart`, `IconApp`,
  - warstwy produktu: `IconDesign`, `IconFrontend`, `IconShield`, `IconApi`, `IconDatabase`, `IconCloud`, `IconRocket` + mapa `layerIcons` (klucze = `id` z `layers.ts`),
  - kontakt i social: `IconMail`, `IconPhone`, `IconPin`, `IconGithub`, `IconInstagram`, `IconFacebook`,
  - UI: `IconArrowUpRight`, `IconArrowDown`, `IconSend`, `IconQuote`, `IconStar`, `IconCheck`, `IconAlert`,
  - `IconMenu` — hamburger morfujący w „X” przez `aria-expanded`,
  - `BrandMark` — znak marki identyczny z favicon.
- **Gdzie użyte:** nawigacja, lista warstw w hero, akordeon „Warsztat”, karty usług (odznaka z ikoną), opinie, „O mnie”, kontakt, stopka.
- `lucide-react` zostaje w pozostałych plikach (`ProjectMedia`, panel admina, starsze komponenty) — nie ma potrzeby ruszać wszystkiego naraz.

---

## 3. Favicon i zestaw ikon aplikacji

| Plik | Zmiana |
|---|---|
| `public/favicon.svg` | Nowy: grafitowy kafel, stalowa poświata, glif terminala `>_` w gradiencie `#f1f8fc → #8fc0de` |
| `favicon-16/32/48.png`, `favicon.ico` | Wygenerowane z tej samej geometrii (ICO zawiera 16, 32, 48 px) |
| `android-chrome-192/512.png` | Odświeżone |
| `apple-touch-icon.png` | Pełne tło bez przezroczystości (iOS sam zaokrągla) |
| `maskable-icon-512x512.png` | **Nowy** — glif w strefie bezpiecznej 70 %, dla Androida |
| `site.webmanifest` | Dodany wpis `maskable`; `theme_color`/`background_color` = `#0b0d0f` (wcześniej `#060913` — inny odcień niż strona) |
| `layout.tsx` | SVG jako pierwsza ikona, ICO `sizes: "any"`, `viewport.themeColor` i `colorScheme: "dark"` |
| `scripts/generate_icons.py` | Skrypt regenerujący wszystkie PNG/ICO (`python3 scripts/generate_icons.py`, wymaga Pillow i numpy) |

Glif jest **ten sam** w favicon, `BrandMark` w nawigacji i stopce oraz w ikonach PWA — marka jest rozpoznawalna wszędzie.

---

## 4. Przebudowa sekcji

Wszystkie style leżą w nowym pliku `src/components/portfolio/premium.css`, ładowanym **po** `portfolio.css` — dzięki temu stary plik zostaje nietknięty i zmianę można łatwo cofnąć.

| Sekcja | Było | Jest |
|---|---|---|
| **Nawigacja** | Płaski pasek | Znak marki z migającym kursorem, podkreślenie linków rysowane od prawej, szkło po przewinięciu, chowanie przy scrollu w dół, morfujące menu mobilne |
| **Hero** | Statyczny tekst | Maskowane linie `<h1>`, gradient przesuwający się w akcencie, pulsujący status, aurora w tle, ziarno |
| **Pas technologii** *(nowy)* | — | `TechMarquee`: nieskończony pas z technologii pobieranych z `layers.ts` (zawsze zgodny z „Warsztatem”), pauza na hover, w reduced-motion przewijany ręcznie |
| **Projekty** | Siatka kart | Odsłanianie kart, tilt 3D i spotlight na podglądzie, poświata ramki na hover, podkreślenie tytułu rysowane przy najechaniu, skala obrazu 1,035 |
| **Usługi** | Trzy karty | Odznaka z ikoną i animacją rysowania, ramka-gradient za kursorem, kaskadowe wejście, **linia procesu rysowana scrollem** z węzłami przy krokach |
| **Warsztat** | `<details>` | Płynne otwieranie (`::details-content` + `interpolate-size`, bez JS), ikony warstw, kaskada |
| **Opinie** | Karty | Ikona cudzysłowu, gwiazdki własnej ikony reagujące na hover, spotlight |
| **O mnie** | Zdjęcie + tekst | Odsłanianie maską z paralaksą zdjęcia, pigułki „Projekt / Kod / Wdrożenie” (z istniejącego opisu — bez nowych deklaracji) |
| **Kontakt** | Dwie kolumny | Formularz jako karta ze spotlightem, poświata pól w fokusie, etykieta w kolorze akcentu, ikony kanałów, przyciski social jako pigułki, animowane komunikaty |
| **Stopka** | Linki | Znak marki, linia-poświata u góry, kaskadowe wejście kolumn, przesunięcie linków na hover |
| **Strony podrzędne** | — | `PublicPageShell` ładuje `MotionLayer` → nawigacja, stopka, przyciski i karty mają te same efekty na każdej podstronie |

### Zmienione pliki

`ProductStory.tsx`, `ProjectShowcase.tsx`, `ProjectMedia.tsx`, `ServicePaths.tsx`, `AboutSection.tsx`, `PortfolioNav.tsx`, `PublicPageShell.tsx`, `ContactSection.tsx`, `TestimonialsSection.tsx`, `Footer.tsx`, `app/page.tsx`, `app/layout.tsx` — wyłącznie dodatki atrybutów `data-*`, podmiana ikon i drobne wstawki znaczników. **Logika biznesowa, formularz, SEO i dane bez zmian.**

---

## 5. Dostępność

- `prefers-reduced-motion`: bez animacji, bez ukrywania, bez marquee (przewijalne ręcznie), bez paska postępu.
- Fokus klawiatury: nawigacja nie chowa się, gdy ma fokus (`:focus-within`).
- Ikony dekoracyjne mają `aria-hidden`; pas technologii ma `role="region"` i zdublowaną listę ukrytą przed czytnikami.
- Istniejący przełącznik „Ogranicz ruch” w hero działa jak wcześniej.

## 6. Wydajność

- Brak nowych zależności i nowych requestów (ikony inline, ziarno jako data-URI).
- Animacje wyłącznie na kompozytorze (`transform`, `opacity`, `clip-path`).
- Zdarzenia wskaźnika delegowane na kontenerze, listenery tylko dla urządzeń z myszą; na telefonach brak tilt/spotlight/magnesu, ziarno wyłączone poniżej 1024 px.
- SplitText wywoływany tylko dla nagłówków `h2` i `h1` hero.

## 7. Znane ograniczenia i ryzyka

1. **Nie uruchomiłem buildu ani testów** (patrz informacja na górze). Najbardziej prawdopodobne punkty do poprawy po pierwszym `npm run check`: typy `SplitText.create` w `MotionLayer.tsx` oraz reguła lint dla `useEffect`.
2. `::details-content` i `interpolate-size` działają w Chrome/Edge 131+ i Safari 18.4+; w Firefoxie akordeon otwiera się natychmiast (bez animacji, ale poprawnie).
3. Gradient na `h2 > span` używa `background-clip: text` na liniach z SplitText — sprawdź wizualnie, czy przy zawijaniu nie ma szwu.
4. `data-tilt` jest też na podglądach w galerii modalu projektu — jeśli wolisz tam brak ruchu, usuń atrybut z `ProjectMedia` i dodaj go w `ProjectCard`.
5. Starsze komponenty (`ProfessionalHeroSection`, `ImmersiveProjectsSection`, `ScrollBuildSection` itd.) nie są używane na stronie głównej — to martwy kod z poprzednich wersji. Warto je usunąć po sprawdzeniu importów.

## 8. Dalsze kroki (poza tą paczką)

| Priorytet | Zadanie | Uzasadnienie |
|---|---|---|
| Wysoki | Nowy `og-image.jpg` i `opengraph-image.jpg` z nowym znakiem | Udostępnienia w social nadal pokazują starą grafikę |
| Wysoki | Lighthouse mobile po wdrożeniu | Potwierdzenie, że LCP/CLS nie pogorszyły się |
| Średni | Płynny scroll (Lenis) | Dałby „jedwabne” przewijanie; wymaga nowej zależności i integracji z ScrollTrigger |
| Średni | View Transitions API między podstronami | Płynne przejścia route’ów w Next 16 |
| Średni | Wideo-podglądy projektów w sekcji hero | Dane już są (`public/project-previews`) |
| Niski | Jasny motyw | Strona jest wymuszona na `dark`; `project_review.md` wspomina przełącznik, ale wymaga osobnego przeglądu kontrastów |

## 9. Jak cofnąć

Wszystko jest warstwowe. Aby wyłączyć animacje: usuń `<MotionLayer />` z `page.tsx` i `PublicPageShell.tsx` oraz skrypt `motionBootstrap` w `layout.tsx`. Aby wrócić do poprzedniego wyglądu: usuń import `premium.css`. Ikony i favicon są niezależne.

## 10. Wdrożenie krok po kroku

```bash
npm install
npm run check          # lint + typecheck + testy + build
npm run dev            # sprawdź wizualnie: /, /realizacje, /uslugi, /o-mnie, 404
```

Lista kontrolna ręczna:

- [ ] Hero: nagłówek wjeżdża liniami, brak migotania przy odświeżeniu (Ctrl+Shift+R).
- [ ] Scroll przez całą stronę: sekcje odsłaniają się raz, pasek postępu rośnie.
- [ ] Najechanie na kartę usługi/projektu: poświata za kursorem, tilt, ikona się rysuje.
- [ ] `/realizacje?kategoria=web` → zmiana filtra **nie ukrywa** kart.
- [ ] DevTools → Rendering → „Emulate prefers-reduced-motion: reduce” → cała treść widoczna, bez ruchu.
- [ ] Telefon: menu morfuje w „X”, brak ziarna i tilt, scroll płynny.
- [ ] Karta przeglądarki pokazuje nowy favicon (twarde odświeżenie lub nowa karta — przeglądarki cachują ikony), po dodaniu do ekranu głównego ikona jest dobrze przycięta.
