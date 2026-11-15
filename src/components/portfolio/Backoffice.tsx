import Image from "next/image";
import Link from "next/link";
import BackofficeStage from "./BackofficeStage";
import { IconApi, IconArrowUpRight, IconDatabase, IconFrontend, IconShield } from "./icons";

const points = [
  { Icon: IconDatabase, title: "Dane w jednej bazie", text: "Produkty, zamówienia, klienci i wiadomości trafiają do jednego, uporządkowanego miejsca. Znajdziesz je w kilka sekund." },
  { Icon: IconFrontend, title: "Panel do Twojej codziennej pracy", text: "Dodajesz ofertę, zmieniasz ceny i odpowiadasz na zapytania sam, bez pisania do programisty." },
  { Icon: IconShield, title: "Dostęp według ról", text: "Ty decydujesz, kto widzi dane, a kto może je zmieniać. Logowanie jest zabezpieczone." },
  { Icon: IconApi, title: "Połączenia z innymi systemami", text: "Formularz, sklep, płatności i powiadomienia zapisują dane w tym samym miejscu." },
];

export default function Backoffice() {
  return <section id="zaplecze" className="backoffice portfolio-container" aria-labelledby="backoffice-heading">
    <header className="portfolio-section-heading"><div><h2 id="backoffice-heading">Za stroną jest zaplecze.<br />{" "}<span>Zarządzasz nim sam.</span></h2></div><p>Strona, sklep czy aplikacja to także baza danych i panel.<br />{" "}Projektuję je razem z tym, co widzą Twoi klienci.</p></header>
    <div className="backoffice-layout">
      <div>
        <ul className="backoffice-points" data-stagger>{points.map(({ Icon, title, text }) => <li key={title}><Icon size={22} /><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
        <div className="backoffice-actions"><Link className="portfolio-button" href="/demo/panel">Wypróbuj demo panelu <IconArrowUpRight size={17} /></Link><Link className="portfolio-text-link" href="/bazy-danych-i-panele">Bazy danych i panele <IconArrowUpRight size={15} /></Link></div>
      </div>
      <figure className="backoffice-screen" data-reveal>
        <BackofficeStage>
        <div className="stage-frame stage-frame--browser">
          <div className="stage-frame-bar" aria-hidden="true"><span className="stage-frame-dots"><i /><i /><i /></span><span className="stage-frame-label">Panel administratora — produkty</span></div>
          <div className="stage-frame-screen"><Image src="/projects/sklep-internetowy-demo/panel-produktow.webp" alt="Panel administratora sklepu: lista produktów z SKU, kategorią, ceną, stanem magazynowym i przełącznikiem widoczności" fill sizes="(max-width: 1023px) 92vw, 52vw" className="stage-frame-image" /></div>
        </div>
        <div className="backoffice-callouts" aria-hidden="true">
          <span style={{ left: "24%", top: "17%" }}>Wyszukiwanie po nazwie i SKU</span>
          <span style={{ left: "1%", top: "44%" }}>Import produktów</span>
          <span style={{ right: "3%", top: "33%" }}>Ceny i stany</span>
        </div>
        </BackofficeStage>
        <figcaption className="backoffice-caption">Panel z realizacji „Sklep internetowy — demo”: produkty, kategorie i zamówienia w jednej bazie. Dane na zrzucie są przykładowe.</figcaption>
      </figure>
    </div>
  </section>;
}
