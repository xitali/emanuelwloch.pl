import { formatPln } from "@/lib/contracts/amount-words";
import { LEGAL_2026, workForCompanyPayout } from "@/lib/contracts/legal-2026";

const example = workForCompanyPayout(3000, 80);

/** Plain-language walkthrough for someone without a company: what to pick, fill in and do after. */
export default function ContractsGuide({ open, onToggle }: { open: boolean; onToggle: (open: boolean) => void }) {
  return <details className="contracts-guide" open={open} onToggle={e => onToggle((e.currentTarget as HTMLDetailsElement).open)}>
    <summary>Jak to wypełnić — instrukcja krok po kroku</summary>
    <div className="contracts-guide-body">
      <section>
        <h3>Najpierw najważniejsze</h3>
        <p>Nie musisz zakładać firmy, żeby legalnie zrobić komuś stronę, sklep czy program. Wystarczy dobra umowa, a to, jak ją rozliczyć, zależy tylko od jednego: <strong>czy klient jest firmą, czy osobą prywatną</strong>. Panel sam dobierze właściwą umowę, gdy wybierzesz klienta.</p>
      </section>

      <section>
        <h3>Krok 1. Kim jest klient?</h3>
        <div className="contracts-guide-compare">
          <div>
            <h4>Firma <span>(ma NIP)</span></h4>
            <p><strong>Umowa o dzieło.</strong> To firma płaci za Ciebie podatek i zgłasza umowę do ZUS. Ty niczego nie zgłaszasz.</p>
            <ul>
              <li>Bez limitu kwoty.</li>
              <li>Bez składek ZUS.</li>
              <li>Na konto dostajesz kwotę pomniejszoną o zaliczkę na podatek. Przykład: przy {formatPln(3000)} dostaniesz ok. {formatPln(example.payout)}, a {formatPln(example.advanceTax)} firma wpłaci za Ciebie do urzędu.</li>
            </ul>
          </div>
          <div>
            <h4>Osoba prywatna</h4>
            <p><strong>Działalność nierejestrowana.</strong> Klient płaci Ci pełną kwotę, a podatek rozliczasz sam raz w roku.</p>
            <ul>
              <li>Limit: {formatPln(LEGAL_2026.unregisteredQuarterLimit)} na kwartał, liczony ze wszystkich klientów prywatnych razem.</li>
              <li>Bez składek ZUS i bez rejestracji.</li>
              <li>Klient ma 14 dni na odstąpienie, jeśli podpisujecie umowę na odległość.</li>
            </ul>
          </div>
        </div>
        <p className="contracts-guide-tip"><strong>Klient ma jednoosobową firmę</strong> (np. fryzjer, warsztat, sklep)? Wybierz „Firma” i zaznacz pole o prawach konsumenta, jeśli nie zajmuje się zawodowo stronami, IT ani marketingiem. Tak jest bezpieczniej: przysługują mu wtedy te same prawa co osobie prywatnej.</p>
        <p className="contracts-guide-tip">Która opcja jest lepsza? Żadna nie jest „lepsza”, to klient decyduje, która pasuje. Przy firmie jest wygodniej, bo nie pilnujesz limitu i nie rozliczasz zaliczek. Przy osobie prywatnej dostajesz całą kwotę, ale pilnujesz limitu kwartalnego.</p>
      </section>

      <section>
        <h3>Krok 2. Co wpisać</h3>
        <ol>
          <li><strong>Dane klienta.</strong> Firma: pełna nazwa, adres, NIP i osoba, która podpisuje (właściciel albo prezes). Dane firmy sprawdzisz w wyszukiwarce CEIDG lub KRS na biznes.gov.pl. Osoba prywatna: imię, nazwisko, adres.</li>
          <li><strong>Dzieło i zakres.</strong> Wybierz usługę z listy i dopisz konkretnie, co klient dostaje: liczba podstron, funkcje, panel, wersja na telefon. Im dokładniej, tym mniej sporów o to, co było w cenie.</li>
          <li><strong>Terminy.</strong> Data umowy, start prac, termin oddania. Jeśli klient spóźni się z materiałami, umowa automatycznie przesuwa termin.</li>
          <li><strong>Kwota.</strong> Przy firmie wpisz kwotę brutto, czyli tę przed podatkiem. Pod polem zobaczysz, ile trafi na Twoje konto. Przy osobie prywatnej wpisz kwotę, którą klient Ci zapłaci.</li>
          <li><strong>Zaliczka i płatność.</strong> Np. 30% zaliczki po podpisaniu, reszta 7 dni po odbiorze.</li>
          <li><strong>Honorarium autorskie</strong> (tylko przy firmie). Zostaw 80%. To część kwoty za prawa autorskie, dzięki której firma potrąci Ci mniejszą zaliczkę na podatek.</li>
          <li><strong>Rundy poprawek i poprawki błędów.</strong> Ile razy klient może prosić o zmiany w cenie (np. 2) i przez ile dni po oddaniu poprawiasz błędy za darmo (np. 30).</li>
          <li><strong>Twoje dane.</strong> Imię, nazwisko, adres, e-mail, numer konta. PESEL jest potrzebny, gdy klientem jest firma (do formularza PIT-11). Możesz zaznaczyć „Zapamiętaj”, żeby nie wpisywać ich za każdym razem. Zostaną tylko w tej przeglądarce.</li>
        </ol>
      </section>

      <section>
        <h3>Krok 3. Podpisanie</h3>
        <ol>
          <li>Kliknij <strong>Drukuj / zapisz PDF</strong> i wydrukuj umowę w 2 egzemplarzach.</li>
          <li><strong>Podpiszcie obaj odręcznie, na papierze.</strong> Umowa przenosi prawa autorskie, a to wymaga formy pisemnej pod rygorem nieważności. Sama wymiana maili albo skan nie wystarczy. Możecie wysłać sobie egzemplarze pocztą albo kurierem. Zamiast podpisu na papierze można użyć kwalifikowanego podpisu elektronicznego.</li>
          <li>Po skończeniu pracy podpiszcie <strong>protokół odbioru</strong> (jest w załączniku). To dowód, że klient odebrał dzieło. Od tej daty liczy się termin zapłaty.</li>
        </ol>
      </section>

      <section>
        <h3>Krok 4. Co dalej? Czy muszę coś gdzieś zanosić?</h3>
        <div className="contracts-guide-compare">
          <div>
            <h4>Klient firma</h4>
            <ul>
              <li><strong>Nigdzie nic nie zanosisz.</strong> Firma w ciągu {LEGAL_2026.rudDays} dni zgłasza umowę do ZUS (formularz RUD) i odprowadza za Ciebie zaliczkę na podatek.</li>
              <li>Firma może poprosić o <strong>rachunek do umowy</strong>: prosty dokument z Twoimi danymi, kwotą i odwołaniem do umowy.</li>
              <li>Do końca lutego następnego roku dostaniesz od firmy <strong>PIT-11</strong>.</li>
              <li>Do 30 kwietnia składasz zeznanie roczne, np. w e-Urzędzie Skarbowym (podatki.gov.pl). Masz tylko umowy z firmami? To <strong>PIT-37</strong>. Często część podatku wraca dzięki kwocie wolnej 30 000 zł rocznie.</li>
            </ul>
          </div>
          <div>
            <h4>Klient prywatny</h4>
            <ul>
              <li><strong>Nigdzie nie zgłaszasz działalności</strong>, nie płacisz ZUS i nie masz miesięcznych rozliczeń.</li>
              <li>Prowadzisz <strong>prostą ewidencję sprzedaży</strong>, czyli tabelę: data, za co, kwota, suma w kwartale. Wpis robisz najpóźniej następnego dnia po sprzedaży.</li>
              <li>Jeśli klient poprosi, wystawiasz mu <strong>rachunek</strong> (bez VAT).</li>
              <li>Pilnuj limitu {formatPln(LEGAL_2026.unregisteredQuarterLimit)} na kwartał. Kalkulator jest pod kwotą w formularzu. Po przekroczeniu masz {LEGAL_2026.ceidgDays} dni na zarejestrowanie firmy.</li>
              <li>Do 30 kwietnia składasz <strong>PIT-36</strong> z sekcją „działalność nierejestrowana”. Jeśli w tym samym roku masz też umowy z firmami, wpisujesz je w tym samym PIT-36.</li>
            </ul>
          </div>
        </div>
        <p className="contracts-guide-tip">Umowy, protokoły i ewidencję przechowuj przez 5 lat od końca roku, w którym rozliczyłeś podatek.</p>
      </section>

      <section>
        <h3>Gdy masz wątpliwości</h3>
        <p>Zadzwoń do Krajowej Informacji Skarbowej: 22 330 03 30 (z komórki) lub 801 055 055 (z telefonu stacjonarnego). To bezpłatne, a konsultanci odpowiadają na takie pytania. Przy pierwszej umowie warto też pokazać ją księgowemu. Ten panel to wzór, nie porada prawna. Kwoty i limity sprawdzisz pod przyciskiem „Do jakiej kwoty i jak rozliczyć”.</p>
      </section>
    </div>
  </details>;
}
