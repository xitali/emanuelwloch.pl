import Link from "next/link";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import { IconArrowUpRight } from "@/components/portfolio/icons";

const shortcuts = [["/uslugi", "Oferta"], ["/realizacje", "Realizacje"], ["/poradniki", "Poradniki"], ["/#kontakt", "Kontakt"]] as const;

export default function NotFound() {
  return <PublicPageShell><main id="main-content" className="portfolio-subpage portfolio-status"><h1>Nie ma tu tej strony.</h1><p>Adres może być nieaktualny. Wróć na stronę główną albo przejdź od razu tam, gdzie chcesz trafić.</p><div className="portfolio-actions"><Link href="/" className="portfolio-button">Strona główna <IconArrowUpRight size={17} /></Link></div><nav aria-label="Na skróty" className="svc-related status-links">{shortcuts.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav></main></PublicPageShell>;
}
