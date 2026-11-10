# Archiwalny audyt projektu — nieaktualny

> Ten dokument opisuje starszy stan aplikacji. Aktualne informacje znajdują
> się w `README.md`, `SECURITY.md`, migracjach oraz konfiguracji CI.

# 🚀 Pełny Audyt i Plan Rozwoju (Project Review)

Dokument dotyczył starszej wersji projektu (Next.js 15) i pozostaje wyłącznie
jako zapis historyczny.

---

## 1. ⚡ Optymalizacja i Wydajność (Performance & SEO)

*   **Zmiana tagów HTML `<img>` na `<Image>` z Next.js**:
    W plikach takich jak `HeroSection.tsx`, `ProjectsSection.tsx` oraz `ProjectModal.tsx` obecnie używany jest standardowy znacznik `<img>`.
    **Co to zmieni?** Komponent z Next.js automatycznie konwertuje zdjęcia do ultra-lekkiego formatu WebP/AVIF, zapewnia leniwe ładowanie (lazy loading) poza oknem przeglądarki i zapobiega przesunięciom układu strony (CLS).
*   **Priorytetyzacja obrazu okładkowego**: Zdjęcie profilowe w `HeroSection` powinno mieć atrybut `priority={true}`, ponieważ znajduje się w początkowym widoku po załadowaniu (Above The Fold).
*   **Blog / Artykuły eksperckie**: Jako developer budujący zasięgi B2B, powinieneś dodać system bloga. Warto utworzyć tabelę `blog_posts` w Turso i dynamiczny route `/blog/[slug]`. To generuje gigantyczny darmowy ruch SEO z wyszukiwarek.

## 2. 🔐 Bezpieczeństwo i Backend (Security & Robustness)

*   **Rate Limiting (Limitowanie zapytań) w formularzu kontaktowym**: Twój endpoint kontaktowy może przyjąć nieskończoną ilość wiadomości. Boty mogą łatwo zaspamować Twoją bazę Turso tysiącami wiadomości. **Należy dodać Rate Limiter** (np. przy użyciu darmowego *Upstash Redis* lub prostej pamięci Node.js), by blokować spam z jednego IP.
*   **Ścisła walidacja (Zod)**: Zabezpieczenie przed atakami (XSS i śmieciowymi danymi). Zamiast polegać na wbudowanej walidacji HTML `required`, warto na backendzie użyć biblioteki `zod` do dokładnego sprawdzania i czyszczenia danych wchodzących, zanim trafią do bazy.

## 3. 🛠️ Panel Administratora i Funkcjonalności (CMS)

*   **Menadżer plików i obrazów (Cloudinary / AWS S3)**:
    Obecnie wprowadzanie projektów w panelu admina zakłada podawanie linków URL. Zintegrowanie zewnętrznej chmury pozwoliłoby na wygodne wgrywanie obrazów bezpośrednio z przeglądarki w Panelu Admina bez konieczności ręcznego wrzucania plików na serwer czy Vercel.
*   **Wizualizacja Analityki (Wykresy)**: Tabela `page_visits` zbiera informacje, ale nie ma wizualnego panelu. Warto zaimplementować bibliotekę taką jak np. `recharts`, aby stworzyć piękny, interaktywny wykres liniowy pokazujący zyski/ruch z ostatnich 30 dni wewnątrz admina.
*   **Sekcja z Opiniami (Testimonials)**: Dodanie opinii i rekomendacji klientów B2B na stronie głównej w formie przesuwanej karuzeli. Wymagałoby to dodania nowej tabeli w bazie oraz formularza w adminie. To potężnie buduje zaufanie!

## 4. 🎨 Interfejs i Doświadczenie Użytkownika (UI / UX)

*   **Niestandardowa obsługa błędów (Custom 404 / Error Pages)**: Obecnie wejście na nieistniejący adres w domenie wyświetla domyślną, czarno-białą stronę Vercel/Next.js. Własne pliki `app/not-found.tsx` oraz `app/error.tsx` utrzymają spójny klimat Twojego studia.
*   **Wielojęzyczność (i18n)**: Dodanie wsparcia dla wersji angielskiej (EN). Dla Software Developera to drzwi na zlecenia międzynarodowe. Aplikacja mogłaby automatycznie dostosowywać język do lokalizacji użytkownika.
*   **Tryb Jasny (Light Mode / Dark Mode Toggle)**: Zaimplementowanie szybkiego przełącznika motywu. Wielu tradycyjnych dyrektorów B2B preferuje bardzo jasne, proste, "czyste" białe motywy zamiast developerskiego "Dark Mode".

---

### Podsumowanie

Twój projekt jest bardzo solidną bazą. Powyższe punkty to naturalne kroki w cyklu życia aplikacji, by uczynić ją w pełni produkcyjną, bezpieczną i skalowalną w środowisku Vercel. 
Wybierz punkty, które uważasz za najważniejsze i możemy zacząć je wdrażać!
