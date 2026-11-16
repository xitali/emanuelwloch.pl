import Link from "next/link";
import { BrandMark, IconArrowUpRight, IconGithub } from "./portfolio/icons";
const groups = [
  { title: "Usługi", links: [["/tworzenie-stron-internetowych", "Strony internetowe"], ["/sklepy-internetowe", "Sklepy internetowe"], ["/tworzenie-aplikacji-webowych", "Aplikacje webowe"], ["/bazy-danych-i-panele", "Bazy danych i panele"], ["/programy-na-windows", "Programy na Windows"], ["/nextjs-developer", "Next.js developer"]] },
  { title: "Lokalnie", links: [["/tworzenie-stron-internetowych-jaroslaw", "Strony internetowe Jarosław"], ["/tworzenie-stron-internetowych-rzeszow", "Strony internetowe Rzeszów"]] },
  { title: "Informacje", links: [["/uslugi", "Pełna oferta"], ["/o-mnie", "O mnie"], ["/poradniki", "Poradniki"], ["/realizacje", "Realizacje"], ["/polityka-prywatnosci", "Polityka prywatności"], ["/polityka-prywatnosci#licencje", "Licencje"]] },
];
export default function Footer(_props: { visitCount?: number }) {
  void _props;
  return <footer className="portfolio-footer"><div className="portfolio-container">
    <div className="portfolio-footer-grid" data-stagger><div><Link href="/" className="portfolio-wordmark" aria-label="Emanuel Włoch — strona główna"><BrandMark size={30} />ew<span>/</span><small>Emanuel Włoch</small></Link><p>Strony, sklepy, aplikacje z bazą danych i programy na Windows. Od pomysłu do wdrożenia u jednego wykonawcy.</p><p>Jarosław, Podkarpackie<br />{" "}Współpraca zdalna w całej Polsce</p></div>
    {groups.map(group => <nav key={group.title} aria-label={`${group.title} w stopce`}><h2>{group.title}</h2><ul>{group.links.map(([href,label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></nav>)}</div>
    <div className="portfolio-footer-bottom"><span>© {new Date().getFullYear()} Emanuel Włoch</span><a href="https://github.com/xitali" target="_blank" rel="noopener noreferrer"><IconGithub />GitHub<IconArrowUpRight size={14} /></a></div>
  </div></footer>;
}
