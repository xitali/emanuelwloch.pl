import type { Contract } from "@/lib/contracts/contract";

/** The contract as an A4 document: letterhead, parties, key terms, numbered clauses, signatures, annexes. */
export default function ContractDocument({ contract, number, signedOn, contact, signers }: {
  contract: Contract;
  number: string;
  signedOn: string;
  contact: { email: string; phone?: string };
  signers: [string, string];
}) {
  return <article className="doc" aria-label="Podgląd umowy">
    <header className="doc-head">
      <div className="doc-brand"><span className="doc-mark">ew</span><span>Emanuel Włoch<small>Strony · sklepy · aplikacje · programy</small></span></div>
      <div className="doc-meta"><strong>emanuelwloch.pl</strong><span>{contact.email}</span>{contact.phone && <span>{contact.phone}</span>}</div>
    </header>

    <div className="doc-title">
      <p className="doc-kicker">{number ? `Umowa nr ${number}` : "Umowa"}</p>
      <h1>{contract.title}</h1>
      <p className="doc-sub">{contract.preamble[0]}</p>
    </div>

    <div className="doc-parties">
      {contract.parties.map(party => <section key={party.role} className="doc-party">
        <p className="doc-label">{party.role}</p>
        <p className="doc-party-name">{party.name}</p>
        {party.details.map(line => <p key={line}>{line}</p>)}
        <p className="doc-party-alias">zwany dalej „{party.role === "Wykonawca" ? "Wykonawcą" : "Zamawiającym"}”</p>
      </section>)}
    </div>

    <section className="doc-summary" aria-label="Najważniejsze warunki">
      <p className="doc-label">Najważniejsze warunki</p>
      <dl>{contract.keyTerms.map(term => <div key={term.label}><dt>{term.label}</dt><dd>{term.value}</dd></div>)}</dl>
      <p className="doc-summary-note">Podsumowanie ułatwia lekturę. Wiążąca jest treść paragrafów poniżej.</p>
    </section>

    {contract.sections.map((section, s) => {
      const [, title = section.heading] = section.heading.split(". ");
      return <section key={section.heading} className="doc-section">
        <h2><span>§ {s + 1}</span>{title}</h2>
        <ol>{section.items.map((item, i) => <li key={i}><span className="doc-num">{s + 1}.{i + 1}</span><p>{item}</p></li>)}</ol>
      </section>;
    })}

    <div className="doc-signatures">
      {contract.signatures.map((role, i) => <div key={role} className="doc-sign">
        <p className="doc-label">{role}</p>
        <div className="doc-sign-line"><span>Miejsce i data</span></div>
        <div className="doc-sign-line doc-sign-line--tall"><span>Czytelny podpis</span></div>
        <p className="doc-sign-name">{signers[i] || " "}</p>
      </div>)}
    </div>

    {contract.annexes.map(annex => <section key={annex.heading} className="doc-annex">
      <header><p className="doc-kicker">{annex.heading} do umowy {number ? `nr ${number}` : ""} z dnia {signedOn}</p><h2>{annex.title}</h2></header>
      {annex.items.map((item, i) => <p key={i} className={/^(Dzieło odebrano|Przekazano):/.test(item) ? "doc-annex-check" : undefined}>{item}</p>)}
    </section>)}
  </article>;
}
