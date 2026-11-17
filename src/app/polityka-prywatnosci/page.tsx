import { createPageMetadata } from "@/lib/content/seo";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createPageMetadata({
  title: "Polityka prywatności",
  description: "Informacje o przetwarzaniu danych przesyłanych przez formularz kontaktowy.",
  path: "/polityka-prywatnosci",
});

export default function PrivacyPolicyPage() {
  return (
    <PublicPageShell><main id="main-content" className="portfolio-subpage portfolio-legal">
      <article className="portfolio-legal-content space-y-8">
        <header className="space-y-3">
          <p className="font-mono text-sm text-[var(--p-accent)] dark:text-[var(--p-accent)]">
            Ostatnia aktualizacja: 29 lipca 2026 r.
          </p>
          <h1 className="text-3xl font-extrabold text-[var(--p-muted)] dark:text-white sm:text-4xl">
            Polityka prywatności
          </h1>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Administrator danych</h2>
          <p>
            Administratorem danych jest Emanuel Włoch. W sprawach dotyczących
            prywatności napisz na{" "}
            <a className="text-[var(--p-accent)] underline dark:text-[var(--p-accent)]" href="mailto:kontakt@emanuelwloch.pl">
              kontakt@emanuelwloch.pl
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Formularz kontaktowy</h2>
          <p>
            Formularz zapisuje imię, adres e-mail, temat, treść wiadomości i
            datę wysłania. Dane są używane wyłącznie do odpowiedzi, prowadzenia
            korespondencji i ewentualnego przygotowania współpracy.
          </p>
          <p>
            Podstawą przetwarzania jest uzasadniony interes polegający na
            obsłudze zapytań (art. 6 ust. 1 lit. f RODO), a gdy zapytanie
            dotyczy umowy — działania przed jej zawarciem (art. 6 ust. 1 lit. b
            RODO). Podanie danych jest dobrowolne, ale niezbędne do otrzymania
            odpowiedzi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Statystyki i dane techniczne</h2>
          <p>
            Strona zapisuje wyłącznie dzienną, zbiorczą liczbę odsłon
            poszczególnych podstron oraz zagregowane kliknięcia kontaktu i linków do realizacji. Nie zapisujemy parametrów adresu ani unikalnych identyfikatorów odwiedzających. Nowe wpisy statystyczne nie zawierają
            adresu IP, identyfikatora użytkownika ani informacji o
            przeglądarce. Motyw jasny lub ciemny może być zapamiętany lokalnie
            w przeglądarce.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Odbiorcy i okres przechowywania</h2>
          <p>
            Dostawcami infrastruktury są Vercel (hosting i pliki) oraz Turso
            (baza danych). Do powiadomień i potwierdzeń może być używana poczta administratora. Dane formularza są przechowywane do 12 miesięcy od
            zakończenia korespondencji, chyba że prawo lub ustalenie, obrona
            albo dochodzenie roszczeń wymaga dłuższego okresu. Dostawcy mogą
            przetwarzać dane poza EOG na podstawie mechanizmów przewidzianych w
            RODO.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Twoje prawa</h2>
          <p>
            Możesz żądać dostępu, sprostowania, usunięcia lub ograniczenia
            przetwarzania danych oraz wnieść sprzeciw. Gdy podstawą jest umowa,
            możesz także żądać przeniesienia danych. Masz prawo złożyć skargę
            do Prezesa Urzędu Ochrony Danych Osobowych. Dane nie są używane do
            zautomatyzowanego podejmowania decyzji ani profilowania.
          </p>
        </section>

        <section id="licencje" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold">Licencje materiałów</h2>
          <p>
            Modele 3D laptopa i monitora w grafikach i animacjach na stronie
            pochodzą z serwisu Sketchfab i są udostępnione na licencji{" "}
            <a className="underline underline-offset-4" href="https://creativecommons.org/licenses/by/4.0/deed.pl" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
            Modele zostały zmienione: usunięto oznaczenia producenta,
            zmieniono materiały i zoptymalizowano pliki.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li><a className="underline underline-offset-4" href="https://sketchfab.com/3d-models/apple-macbook-pro-2020-dfad155b993b45b593054f8970bd6d70" target="_blank" rel="noopener noreferrer">„Apple MacBook Pro 2020”</a>, autor: CGDELUXE</li>
            <li><a className="underline underline-offset-4" href="https://sketchfab.com/3d-models/pc-monitor-27-inch-06fb18eec19245d4811c4c3c8c7ea567" target="_blank" rel="noopener noreferrer">„PC Monitor 27 inch”</a>, autor: Annelida</li>
          </ul>
        </section>

        <Link
          href="/"
          className="inline-flex rounded-[var(--p-radius)] bg-[var(--p-surface)] px-5 py-3 font-semibold text-white hover:bg-[var(--p-surface)]"
        >
          Wróć na stronę główną
        </Link>
      </article>
    </main></PublicPageShell>
  );
}
