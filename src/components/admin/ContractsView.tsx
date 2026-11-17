"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Copy, Info, Printer } from "lucide-react";
import { buildContract, type Contract, type ContractInput } from "@/lib/contracts/contract";
import { formatPln } from "@/lib/contracts/amount-words";
import { LEGAL_2026, quarterStatus, workForCompanyPayout } from "@/lib/contracts/legal-2026";
import ContractsGuide from "./ContractsGuide";
import ContractDocument from "./ContractDocument";
import { servicePaths } from "@/lib/content/service-paths";
import { useAdmin } from "./AdminContext";

const STORAGE_KEY = "umowa-wykonawca";
const GUIDE_KEY = "umowa-instrukcja-zwinieta";
const today = () => new Date().toISOString().slice(0, 10);
const inDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

/** Your own details, remembered only in this browser when you ask for it. */
function loadContractor(): ContractInput["contractor"] {
  const empty = { name: "Emanuel Włoch", address: "", pesel: "", email: "kontakt@emanuelwloch.pl", phone: "", bank: "" };
  if (typeof window === "undefined") return empty;
  try { return { ...empty, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") }; } catch { return empty; }
}

export function contractToText(contract: Contract) {
  const lines = ["Emanuel Włoch · emanuelwloch.pl", "", contract.title.toUpperCase(), "", ...contract.preamble, ""];
  for (const s of contract.sections) lines.push(s.heading, ...s.items.map((item, i) => `${i + 1}. ${item}`), "");
  lines.push("……………………………                    ……………………………", `${contract.signatures[0]}                                        ${contract.signatures[1]}`, "");
  for (const a of contract.annexes) lines.push("", `${a.heading} — ${a.title}`, ...a.items, "");
  return lines.join("\n");
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="contract-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

export default function ContractsView() {
  const { notify } = useAdmin();
  const [remember, setRemember] = useState(() => typeof window !== "undefined" && Boolean(localStorage.getItem(STORAGE_KEY)));
  const [showInfo, setShowInfo] = useState(false);
  // The guide starts open until it is collapsed once.
  const [guideOpen, setGuideOpen] = useState(() => { try { return typeof window === "undefined" || localStorage.getItem(GUIDE_KEY) !== "1"; } catch { return true; } });
  const toggleGuide = (open: boolean) => { setGuideOpen(open); try { if (open) localStorage.removeItem(GUIDE_KEY); else localStorage.setItem(GUIDE_KEY, "1"); } catch { /* private mode */ } };
  const [quarterSoFar, setQuarterSoFar] = useState(0);
  const [contractNo, setContractNo] = useState(() => { const d = new Date(); return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/01`; });
  const [input, setInput] = useState<ContractInput>(() => ({
    mode: "dzielo",
    contractor: loadContractor(),
    client: { kind: "firma", name: "", address: "", nip: "", representative: "", email: "" },
    consumerRights: false,
    remote: true,
    work: { title: servicePaths[0].title, description: servicePaths[0].scope },
    dates: { signed: today(), start: inDays(3), deadline: inDays(31) },
    price: { amount: 2000, advancePercent: 30, paymentDays: 7, copyrightShare: 80 },
    revisions: 2,
    supportDays: 30,
    place: "Jarosław",
  }));
  const contract = useMemo(() => buildContract(input), [input]);
  const quarter = quarterStatus(quarterSoFar, input.mode === "nierejestrowana" ? input.price.amount : 0);

  const set = <K extends keyof ContractInput>(key: K, value: ContractInput[K]) => setInput(current => ({ ...current, [key]: value }));
  const setContractor = (patch: Partial<ContractInput["contractor"]>) => setInput(current => {
    const contractor = { ...current.contractor, ...patch };
    if (remember) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contractor)); } catch { /* private mode */ }
    return { ...current, contractor };
  });
  const setClient = (patch: Partial<ContractInput["client"]>) => setInput(current => ({ ...current, client: { ...current.client, ...patch } }));
  // A private client is a consumer and is usually served within unregistered activity;
  // a company withholds tax and reports the contract for specific work to ZUS.
  const chooseClientKind = (kind: "firma" | "osoba") => setInput(current => ({ ...current, client: { ...current.client, kind }, consumerRights: kind === "osoba", mode: kind === "osoba" ? "nierejestrowana" : "dzielo" }));
  const toggleRemember = (on: boolean) => {
    setRemember(on);
    try { if (on) localStorage.setItem(STORAGE_KEY, JSON.stringify(input.contractor)); else localStorage.removeItem(STORAGE_KEY); } catch { /* private mode */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(contractToText(contract)); notify("Skopiowano treść umowy."); } catch { notify("Nie udało się skopiować. Zaznacz tekst podglądu ręcznie."); }
  };
  const number = (value: string) => Math.max(0, Number(value.replace(",", ".")) || 0);

  return <section className="admin-view contracts" aria-labelledby="contracts-title">
    <header className="admin-view-head">
      <div><h2 id="contracts-title">Umowy</h2><p>Gotowa umowa dla osoby bez firmy: uzupełnij dane, sprawdź podgląd i wydrukuj albo zapisz jako PDF. Dane klienta nie są nigdzie zapisywane.</p></div>
      <button type="button" className="admin-secondary" aria-expanded={showInfo} onClick={() => setShowInfo(v => !v)}><Info className="w-4 h-4" /> Do jakiej kwoty i jak rozliczyć</button>
    </header>

    <ContractsGuide open={guideOpen} onToggle={toggleGuide} kind={input.client.kind} onChooseKind={chooseClientKind} />

    {showInfo && <aside className="contracts-info" aria-label="Limity i rozliczenie w 2026 roku">
      <p className="contracts-info-date">Stan na {new Date(LEGAL_2026.checkedOn).toLocaleDateString("pl-PL")} · to nie jest porada prawna ani podatkowa</p>
      <div className="contracts-info-grid">
        <div>
          <h3>Klient prywatny → działalność nierejestrowana</h3>
          <ul>
            <li><strong>Limit: {formatPln(LEGAL_2026.unregisteredQuarterLimit)} przychodu na kwartał</strong> (225% płacy minimalnej {formatPln(LEGAL_2026.minimumWage)}). Liczą się kwoty z wystawionych rachunków, także jeszcze niezapłacone.</li>
            <li>Możesz z niej korzystać, jeśli w ostatnich 60 miesiącach nie prowadziłeś firmy.</li>
            <li>Po przekroczeniu limitu w kwartale musisz zarejestrować firmę w CEIDG w ciągu {LEGAL_2026.ceidgDays} dni.</li>
            <li>Prowadzisz uproszczoną ewidencję sprzedaży (wpis za dany dzień najpóźniej przed sprzedażą następnego dnia). Rachunek wystawiasz na żądanie klienta, fakturę, jeśli o nią poprosi w ciągu 3 miesięcy.</li>
            <li>Podatek: raz w roku w PIT-36 (do 30 kwietnia), według skali, bez miesięcznych zaliczek. Możesz odliczyć udokumentowane koszty. Brak składek ZUS.</li>
            <li>VAT: zwolnienie do {formatPln(LEGAL_2026.vatExemptionLimit)} sprzedaży rocznie. Kasa fiskalna: zwolnienie do {formatPln(LEGAL_2026.cashRegisterLimit)} sprzedaży osobom prywatnym rocznie.</li>
            <li>Umowa zawarta na odległość (mail, online): klient ma {LEGAL_2026.consumerWithdrawalDays} dni na odstąpienie bez podania przyczyny. Wzór formularza jest w załączniku umowy.</li>
          </ul>
        </div>
        <div>
          <h3>Klient firma → umowa o dzieło</h3>
          <ul>
            <li><strong>Brak limitu kwotowego.</strong> Według większości źródeł przychód z umowy o dzieło jest osobnym źródłem i nie wlicza się do limitu działalności nierejestrowanej.</li>
            <li>Firma jako płatnik pobiera zaliczkę na podatek i przysyła Ci PIT-11. Zgłasza też umowę do ZUS (formularz RUD) w ciągu {LEGAL_2026.rudDays} dni. Składek ZUS od umowy o dzieło się nie płaci.</li>
            <li>Koszty uzyskania przychodu: 20%, a dla części wynagrodzenia za przeniesienie praw autorskich (np. do programu) 50%, łącznie do {formatPln(LEGAL_2026.copyrightCostCap)} kosztów rocznie. Dlatego umowa wskazuje udział honorarium autorskiego.</li>
            <li>Umowa o dzieło jest na konkretny rezultat (strona, sklep, program). Do stałej, powtarzalnej obsługi lepsza jest firma, bo zlecenie lub umowa o świadczenie usług oznacza składki ZUS po stronie klienta.</li>
            <li>Jednoosobowa firma (JDG) na prawach konsumenta: jeśli strona nie jest dla niej czynnością zawodową, ma prawa konsumenta (14 dni na odstąpienie). Zaznacz to w formularzu.</li>
          </ul>
        </div>
      </div>
      <p className="contracts-info-warn">Jeśli zleceń przybywa i regularnie zbliżasz się do limitu, rozważ założenie firmy (ryczałt dla usług IT, ulga na start). Wątpliwości rozwiąże bezpłatnie Krajowa Informacja Skarbowa: 22 330 03 30 (komórka) lub 801 055 055 (stacjonarny), albo księgowy.</p>
      <details><summary>Źródła</summary><ul>{LEGAL_2026.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul></details>
    </aside>}

    <div className="contracts-layout">
      <form className="contracts-form" onSubmit={event => event.preventDefault()}>
        <fieldset>
          <legend>Klient</legend>
          <div className="contracts-choice" role="radiogroup" aria-label="Kim jest klient">
            <button type="button" role="radio" aria-checked={input.client.kind === "firma"} onClick={() => chooseClientKind("firma")}><strong>Firma</strong><span>umowa o dzieło, firma rozlicza podatek</span></button>
            <button type="button" role="radio" aria-checked={input.client.kind === "osoba"} onClick={() => chooseClientKind("osoba")}><strong>Osoba prywatna</strong><span>działalność nierejestrowana, rachunek</span></button>
          </div>
          {input.client.kind === "firma" && <label className="contract-check"><input type="checkbox" checked={input.consumerRights} onChange={e => set("consumerRights", e.target.checked)} /> Jednoosobowa firma, dla której zamówienie nie jest czynnością zawodową (prawa konsumenta)</label>}
          <label className="contract-check"><input type="checkbox" checked={input.remote} onChange={e => set("remote", e.target.checked)} /> Nie spotykacie się przy podpisaniu (umowę wysyłacie pocztą lub kurierem)</label>
          <Field label="Rodzaj umowy">
            <select value={input.mode} onChange={e => set("mode", e.target.value as ContractInput["mode"])}>
              <option value="dzielo">Umowa o dzieło z przeniesieniem praw autorskich</option>
              <option value="nierejestrowana">Umowa o dzieło w ramach działalności nierejestrowanej</option>
            </select>
          </Field>
          <Field label={input.client.kind === "firma" ? "Nazwa firmy" : "Imię i nazwisko"}><input value={input.client.name} onChange={e => setClient({ name: e.target.value })} /></Field>
          <Field label="Adres"><input value={input.client.address} onChange={e => setClient({ address: e.target.value })} /></Field>
          {input.client.kind === "firma" && <div className="contract-row">
            <Field label="NIP"><input value={input.client.nip} onChange={e => setClient({ nip: e.target.value })} inputMode="numeric" /></Field>
            <Field label="Reprezentant"><input value={input.client.representative} onChange={e => setClient({ representative: e.target.value })} /></Field>
          </div>}
          <Field label="E-mail klienta"><input type="email" value={input.client.email} onChange={e => setClient({ email: e.target.value })} /></Field>
        </fieldset>

        <fieldset>
          <legend>Dzieło i termin</legend>
          <Field label="Numer umowy" hint="Kolejny numer w miesiącu, np. 2026/11/02. Ułatwia porządek w dokumentach."><input value={contractNo} onChange={e => setContractNo(e.target.value)} /></Field>
          <Field label="Szybki wybór">
            <select value="" onChange={e => { const path = servicePaths[Number(e.target.value)]; if (path) set("work", { title: path.title, description: path.scope }); }}>
              <option value="">Wybierz usługę, aby wpisać opis…</option>
              {servicePaths.map((path, index) => <option key={path.href} value={index}>{path.title}</option>)}
            </select>
          </Field>
          <Field label="Nazwa dzieła"><input value={input.work.title} onChange={e => set("work", { ...input.work, title: e.target.value })} /></Field>
          <Field label="Zakres" hint="Konkretnie: co klient dostaje. Np. liczba podstron, funkcje, panel, wersja na telefon."><textarea rows={4} value={input.work.description} onChange={e => set("work", { ...input.work, description: e.target.value })} /></Field>
          <div className="contract-row">
            <Field label="Data umowy"><input type="date" value={input.dates.signed} onChange={e => set("dates", { ...input.dates, signed: e.target.value })} /></Field>
            <Field label="Start prac"><input type="date" value={input.dates.start} onChange={e => set("dates", { ...input.dates, start: e.target.value })} /></Field>
            <Field label="Oddanie do"><input type="date" value={input.dates.deadline} onChange={e => set("dates", { ...input.dates, deadline: e.target.value })} /></Field>
          </div>
          {!input.remote && <Field label="Miejscowość"><input value={input.place} onChange={e => set("place", e.target.value)} /></Field>}
        </fieldset>

        <fieldset>
          <legend>Wynagrodzenie</legend>
          <div className="contract-row">
            <Field label={input.mode === "dzielo" ? "Kwota brutto (zł)" : "Kwota (zł)"}><input inputMode="decimal" value={input.price.amount} onChange={e => set("price", { ...input.price, amount: number(e.target.value) })} /></Field>
            <Field label="Zaliczka (%)"><input inputMode="numeric" value={input.price.advancePercent} onChange={e => set("price", { ...input.price, advancePercent: Math.min(100, number(e.target.value)) })} /></Field>
            <Field label="Dni na zapłatę"><input inputMode="numeric" value={input.price.paymentDays} onChange={e => set("price", { ...input.price, paymentDays: number(e.target.value) })} /></Field>
          </div>
          <div className="contract-row">
            {input.mode === "dzielo" && <Field label="Honorarium autorskie (%)" hint="Część kwoty za prawa autorskie (50% kosztów)."><input inputMode="numeric" value={input.price.copyrightShare} onChange={e => set("price", { ...input.price, copyrightShare: Math.min(100, number(e.target.value)) })} /></Field>}
            <Field label="Rundy poprawek"><input inputMode="numeric" value={input.revisions} onChange={e => set("revisions", number(e.target.value))} /></Field>
            <Field label="Poprawki błędów (dni)"><input inputMode="numeric" value={input.supportDays} onChange={e => set("supportDays", number(e.target.value))} /></Field>
          </div>
          {input.mode === "dzielo" && input.client.kind === "firma" && (() => {
            const payout = workForCompanyPayout(input.price.amount, input.price.copyrightShare);
            return <p className="contracts-payout" role="status">Na Twoje konto: ok. <strong>{formatPln(payout.payout)}</strong>. Firma wpłaci za Ciebie {formatPln(payout.advanceTax)} zaliczki na podatek. Przy rocznym rozliczeniu część może wrócić.</p>;
          })()}
          {input.mode === "nierejestrowana" && <div className={`contracts-limit${quarter.exceeded ? " is-over" : ""}`}>
            <Field label="Twoje rachunki w tym kwartale, bez tej umowy (zł)"><input inputMode="decimal" value={quarterSoFar} onChange={e => setQuarterSoFar(number(e.target.value))} /></Field>
            <div className="contracts-limit-bar" aria-hidden="true"><i style={{ width: `${quarter.share * 100}%` }} /></div>
            <p role="status">{quarter.exceeded
              ? `Ta umowa przekracza kwartalny limit o ${formatPln(-quarter.remaining)}. Po przekroczeniu trzeba zarejestrować firmę w ciągu ${LEGAL_2026.ceidgDays} dni albo przesunąć część na kolejny kwartał.`
              : `Razem w kwartale: ${formatPln(quarter.total)}. Do limitu ${formatPln(LEGAL_2026.unregisteredQuarterLimit)} zostaje ${formatPln(quarter.remaining)}.`}</p>
          </div>}
        </fieldset>

        <fieldset>
          <legend>Twoje dane</legend>
          <Field label="Imię i nazwisko"><input value={input.contractor.name} onChange={e => setContractor({ name: e.target.value })} /></Field>
          <Field label="Adres zamieszkania"><input value={input.contractor.address} onChange={e => setContractor({ address: e.target.value })} /></Field>
          <div className="contract-row">
            <Field label="PESEL" hint={input.mode === "dzielo" && input.client.kind === "firma" ? "Firma potrzebuje go do PIT-11." : "Opcjonalnie."}><input inputMode="numeric" value={input.contractor.pesel} onChange={e => setContractor({ pesel: e.target.value })} /></Field>
            <Field label="Telefon"><input value={input.contractor.phone} onChange={e => setContractor({ phone: e.target.value })} /></Field>
          </div>
          <Field label="E-mail"><input type="email" value={input.contractor.email} onChange={e => setContractor({ email: e.target.value })} /></Field>
          <Field label="Numer konta"><input value={input.contractor.bank} onChange={e => setContractor({ bank: e.target.value })} /></Field>
          <label className="contract-check"><input type="checkbox" checked={remember} onChange={e => toggleRemember(e.target.checked)} /> Zapamiętaj moje dane w tej przeglądarce</label>
        </fieldset>
      </form>

      <div className="contracts-preview">
        <div className="contracts-actions">
          <button type="button" className="admin-primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Drukuj / zapisz PDF</button>
          <button type="button" className="admin-secondary" onClick={copy}><Copy className="w-4 h-4" /> Kopiuj tekst</button>
        </div>
        <div className="doc-frame">
          <ContractDocument contract={contract} number={contractNo} signedOn={new Date(`${input.dates.signed}T12:00:00`).toLocaleDateString("pl-PL")}
            contact={{ email: input.contractor.email, phone: input.contractor.phone }}
            signers={[input.contractor.name, input.client.kind === "firma" ? input.client.representative || input.client.name : input.client.name]} />
        </div>
      </div>
    </div>
  </section>;
}
