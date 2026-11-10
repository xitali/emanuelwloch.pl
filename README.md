# emanuelwloch.pl

Portfolio i lekki CMS Emanuela Włocha. Produkcja działa pod
[emanuelwloch.pl](https://emanuelwloch.pl).

## Stos

- Next.js 16, React 19 i TypeScript
- Tailwind CSS v4 i Framer Motion
- Turso (libSQL), Vercel Blob
- Zod, JOSE, bcrypt, Vitest i GitHub Actions
- natywna aplikacja Android, Firebase Cloud Messaging i awaryjna aplikacja PWA

## Uruchomienie lokalne

1. Zainstaluj Node.js 20.9 lub nowszy.
2. Wykonaj `npm install`.
3. Skopiuj `.env.example` do `.env.local` i wpisz własne wartości.
4. Wykonaj `npm run db:migrate`.
5. Uruchom `npm run dev`.
6. Otwórz `http://localhost:3000`.

## Wymagane zmienne

- `TURSO_DATABASE_URL` — adres bazy Turso.
- `TURSO_AUTH_TOKEN` — token dostępu do bazy.
- `JWT_SECRET` — losowy sekret sesji, minimum 32 znaki.
- `RATE_LIMIT_SALT` — osobny losowy sekret do anonimizacji identyfikatorów.
- `BLOB_READ_WRITE_TOKEN` — token magazynu Vercel Blob dla obrazów CMS.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — publiczny klucz powiadomień Web Push.
- `VAPID_PRIVATE_KEY` — prywatny klucz powiadomień przechowywany wyłącznie po stronie serwera.
- `VAPID_SUBJECT` — adres kontaktowy właściciela kluczy, np. `mailto:adres@example.com`.
- `FIREBASE_PROJECT_ID` — identyfikator projektu Firebase.
- `FIREBASE_CLIENT_EMAIL` — konto serwisowe używane wyłącznie przez serwer.
- `FIREBASE_PRIVATE_KEY_BASE64` — zakodowany klucz konta serwisowego; nigdy nie trafia do aplikacji.

Nie wpisuj wartości tych zmiennych do kodu ani do zgłoszeń GitHub.

## Kontrola jakości

`npm run check` uruchamia lint, kontrolę typów, testy i build produkcyjny.
Każdy push oraz pull request jest sprawdzany również przez GitHub Actions.

## Baza danych

- `npm run db:migrate` — uruchamia wszystkie brakujące migracje, w tym tabelę subskrypcji powiadomień.
- `npm run db:repair` — stosuje zatwierdzone poprawki treści produkcyjnych.

Migracje są wykonywane jednokrotnie i zapisywane w `schema_migrations`.
Historyczna tabela `page_visits` została usunięta po przeniesieniu danych do
anonimowych statystyk dziennych.

## Aplikacja Android

Natywny projekt Kotlin/Jetpack Compose znajduje się w `android-admin/`.
Aplikacja loguje się do osobnego, chronionego API, przechowuje token sesji
w Android Keystore i odbiera natywne powiadomienia przez Firebase Cloud
Messaging. Szczegóły instalacji opisuje [ANDROID_APP.md](./ANDROID_APP.md).

Panel `/admin` pozostaje instalowalną aplikacją PWA jako rozwiązanie awaryjne.

## Bezpieczeństwo

Zasady zgłaszania problemów opisuje [SECURITY.md](./SECURITY.md).

## Dokumentacja przeglądów

- [Plan odświeżenia](docs/PLAN_PREMIUM_REDESIGN.md)
- [Przegląd projektu](docs/project_review.md)
- [Lista wdrożeniowa](docs/DEPLOYMENT_CHECKLIST.md)
