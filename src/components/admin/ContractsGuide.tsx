import { Archive, Banknote, Building2, CalendarDays, ClipboardCheck, Gauge, Landmark, ListChecks, PenLine, Phone, Printer, Receipt, ShieldCheck, Signature, UserRound, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatPln } from "@/lib/contracts/amount-words";
import { LEGAL_2026, workForCompanyPayout } from "@/lib/contracts/legal-2026";

type Kind = "firma" | "osoba";
const example = workForCompanyPayout(3000, 80);
const limit = formatPln(LEGAL_2026.unregisteredQuarterLimit);

const PATHS: Record<Kind, { icon: LucideIcon; title: string; contract: string; facts: Array<{ icon: LucideIcon; label: string; value: string }> }> = {
  firma: {
    icon: Building2, title: "Klient to firma", contract: "Umowa o dzieło",
    facts: [
      { icon: Gauge, label: "Limit kwoty", value: "brak" },
      { icon: ShieldCheck, label: "ZUS", value: "nie płacisz" },
      { icon: Wallet, label: "Na konto", value: `ok. ${formatPln(example.payout)} z ${formatPln(3000)}` },
    ],
  },
  osoba: {
    icon: UserRound, title: "Klient to osoba prywatna", contract: "Działalność nierejestrowana",
    facts: [
      { icon: Gauge, label: "Limit", value: `${limit} / kwartał` },
      { icon: ShieldCheck, label: "ZUS", value: "nie płacisz" },
      { icon: Wallet, label: "Na konto", value: "cała kwota" },
    ],
  },
};

const FILL: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: UserRound, title: "Dane klienta", text: "Firmę sprawdzisz w CEIDG lub KRS (biznes.gov.pl)." },
  { icon: ListChecks, title: "Zakres", text: "Konkretnie: podstrony, funkcje, panel, wersja na telefon." },
  { icon: CalendarDays, title: "Terminy", text: "Spóźnione materiały od klienta przesuwają termin." },
  { icon: Banknote, title: "Kwota i zaliczka", text: "Np. 30% po podpisaniu, reszta 7 dni po odbiorze." },
  { icon: PenLine, title: "Poprawki", text: "Np. 2 rundy zmian i 30 dni na darmowe błędy." },
  { icon: Wallet, title: "Twoje dane", text: "„Zapamiętaj” trzyma je tylko w tej przeglądarce." },
];

const AFTER: Record<Kind, Array<{ when: string; icon: LucideIcon; text: React.ReactNode }>> = {
  firma: [
    { when: "Do 7 dni", icon: Landmark, text: <>Firma zgłasza umowę do ZUS (RUD) i płaci za Ciebie zaliczkę na podatek. <strong>Ty nic nie zanosisz.</strong></> },
    { when: "Przy zapłacie", icon: Receipt, text: <>Jeśli firma poprosi, dajesz <strong>rachunek do umowy</strong>.</> },
    { when: "Do końca lutego", icon: Archive, text: <>Dostajesz od firmy <strong>PIT-11</strong>.</> },
    { when: "Do 30 kwietnia", icon: ClipboardCheck, text: <><strong>PIT-37</strong> w e-Urzędzie Skarbowym. Część podatku często wraca.</> },
  ],
  osoba: [
    { when: "Dzień po sprzedaży", icon: ListChecks, text: <>Wpis do <strong>ewidencji sprzedaży</strong>: data, za co, kwota.</> },
    { when: "Na prośbę klienta", icon: Receipt, text: <>Wystawiasz <strong>rachunek</strong> (bez VAT).</> },
    { when: "Co kwartał", icon: Gauge, text: <>Pilnujesz limitu <strong>{limit}</strong>. Po przekroczeniu masz {LEGAL_2026.ceidgDays} dni na rejestrację firmy.</> },
    { when: "Do 30 kwietnia", icon: ClipboardCheck, text: <><strong>PIT-36</strong> z sekcją „działalność nierejestrowana”.</> },
  ],
};

/** Visual, plain-language walkthrough for someone without a company. Shows only the path for the chosen client. */
export default function ContractsGuide({ open, onToggle, kind, onChooseKind }: { open: boolean; onToggle: (open: boolean) => void; kind: Kind; onChooseKind: (kind: Kind) => void }) {
  const path = PATHS[kind];
  return <details className="contracts-guide" open={open} onToggle={e => onToggle((e.currentTarget as HTMLDetailsElement).open)}>
    <summary>Jak to wypełnić — 4 kroki</summary>
    <div className="guide">
      <ol className="guide-steps" aria-label="Kroki">
        {[[UserRound, "Wybierz klienta"], [ListChecks, "Wypełnij pola"], [Signature, "Podpiszcie"], [CalendarDays, "Rozlicz"]].map(([Icon, label], i) => {
          const I = Icon as LucideIcon;
          return <li key={i}><span className="guide-step-icon"><I size={18} aria-hidden /></span><span><small>Krok {i + 1}</small>{label as string}</span></li>;
        })}
      </ol>

      <section className="guide-block">
        <h3><span>1</span>Kim jest klient?</h3>
        <div className="guide-paths" role="radiogroup" aria-label="Rodzaj klienta">
          {(Object.keys(PATHS) as Kind[]).map(k => {
            const p = PATHS[k];
            return <button key={k} type="button" role="radio" aria-checked={kind === k} className="guide-path" onClick={() => onChooseKind(k)}>
              <p.icon size={26} aria-hidden /><strong>{p.title}</strong><span>{p.contract}</span>
            </button>;
          })}
        </div>
        <div className="guide-facts">
          <path.icon size={20} aria-hidden />
          {path.facts.map(f => <div key={f.label}><f.icon size={15} aria-hidden /><span>{f.label}</span><strong>{f.value}</strong></div>)}
        </div>
        <p className="guide-note">{kind === "firma"
          ? <>Jednoosobowa firma spoza branży IT (fryzjer, warsztat)? Zaznacz w formularzu <strong>prawa konsumenta</strong>.</>
          : <>Limit liczy się ze wszystkich klientów prywatnych razem. Umowa na odległość daje klientowi 14 dni na odstąpienie.</>}</p>
      </section>

      <section className="guide-block">
        <h3><span>2</span>Co wpisać</h3>
        <div className="guide-fill">
          {FILL.map(f => <div key={f.title}><f.icon size={18} aria-hidden /><strong>{f.title}</strong><p>{f.text}</p></div>)}
          {kind === "firma" && <div><Banknote size={18} aria-hidden /><strong>Kwota brutto i 80%</strong><p>Pod polem widać, ile trafi na konto. 80% to honorarium autorskie (niższy podatek).</p></div>}
        </div>
      </section>

      <section className="guide-block">
        <h3><span>3</span>Podpisanie</h3>
        <div className="guide-sign">
          <figure aria-hidden>
            <svg viewBox="0 0 120 80" width="120" height="80"><rect x="8" y="10" width="44" height="60" rx="3" fill="#fff" stroke="currentColor" strokeOpacity=".35" /><rect x="30" y="6" width="44" height="60" rx="3" fill="#fff" stroke="currentColor" strokeOpacity=".5" /><path d="M37 18h28M37 25h30M37 32h22" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" /><path d="M38 54c6-8 9 4 14-2s6-4 10 0" fill="none" stroke="#b5643b" strokeWidth="2" strokeLinecap="round" /><path d="M86 62l22-22 5 5-22 22-7 2z" fill="#b5643b" opacity=".85" /></svg>
          </figure>
          <ol>
            <li><Printer size={16} aria-hidden /><span><strong>Drukuj / zapisz PDF</strong> — 2 egzemplarze.</span></li>
            <li><Signature size={16} aria-hidden /><span><strong>Podpis odręczny</strong> (albo kwalifikowany e-podpis). Skan ani mail nie wystarczą — prawa autorskie wymagają formy pisemnej.</span></li>
            <li><ClipboardCheck size={16} aria-hidden /><span>Po oddaniu pracy <strong>protokół odbioru</strong> z załącznika. Od tej daty liczy się termin zapłaty.</span></li>
          </ol>
        </div>
      </section>

      <section className="guide-block">
        <h3><span>4</span>Co dalej</h3>
        <ol className="guide-timeline">
          {AFTER[kind].map(step => <li key={step.when}><span className="guide-dot"><step.icon size={15} aria-hidden /></span><small>{step.when}</small><p>{step.text}</p></li>)}
        </ol>
        <p className="guide-note">Dokumenty trzymaj 5 lat od końca roku rozliczenia.</p>
      </section>

      <aside className="guide-help">
        <Phone size={18} aria-hidden />
        <p><strong>Wątpliwości?</strong> Krajowa Informacja Skarbowa, bezpłatnie: <a href="tel:+48223300330">22 330 03 30</a> (komórka) · <a href="tel:801055055">801 055 055</a>. Ten panel to wzór, nie porada prawna.</p>
      </aside>
    </div>
  </details>;
}
