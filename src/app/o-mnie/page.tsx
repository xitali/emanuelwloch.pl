import { createPageMetadata, getProjectPath, serializeJsonLd, SITE_URL } from "@/lib/content/seo";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
import { IconApp, IconArrowUpRight, IconCart, IconDatabase, IconGithub, IconPin, IconSite } from "@/components/portfolio/icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/server/turso";

const USEME_URL = "https://useme.com/pl/roles/contractor/emanuel-wloch%2C525723/";

export const metadata: Metadata = createPageMetadata({
  title: "O mnie — wykonawca stron, aplikacji i programów",
  description: "Poznaj wykonawcę swojego projektu. Emanuel Włoch z Jarosławia projektuje i programuje strony, sklepy, aplikacje z bazą danych i programy na Windows.",
  path: "/o-mnie", image: "/og/o-mnie.jpg", type: "profile",
});

const areas = [
  { Icon: IconSite, title: "Strony firmowe", text: "Strony z ofertą, realizacjami i kontaktem, dopasowane do telefonu i przygotowane do Google.", stack: ["Next.js", "React", "TypeScript"], proof: ["vip-transfery-platforma-premium-transport-solutions", "rzeszow-tatuaz-iluminatia-tattoo"] },
  { Icon: IconCart, title: "Sklepy i aplikacje webowe", text: "Katalogi, koszyki, formularze wycen i aplikacje z logowaniem, w których klient lub zespół wykonuje konkretne zadania.", stack: ["Next.js", "Supabase", "Payload CMS"], proof: ["solid-print", "mototrasa-tour-aplikacja-wypozyczalni-motocykli", "lapki-w-ciapki-sklep-zoologiczny"] },
  { Icon: IconDatabase, title: "Bazy danych i panele", text: "Struktura danych, panel administratora, role i import. Tak działa też zaplecze tej strony.", stack: ["Turso", "Prisma", "SQLite"], proof: ["sklep-internetowy-demo", "emanuel-wloch-full-stack-software-engineer-edge-platform"] },
  { Icon: IconApp, title: "Programy na Windows i TV", text: "Aplikacje desktopowe z lokalną bazą i wykresami oraz interfejs telewizora obsługiwany pilotem.", stack: ["C#", ".NET", "WPF", "Tizen"], proof: ["wardogs-companion", "coco-aplikacja-tv"] },
];

const principles = [
  { title: "Najpierw Twój cel", text: "Zanim wybierzemy technologię, ustalimy, co ma się zmienić w Twojej firmie i po czym poznasz, że projekt działa." },
  { title: "Jedna osoba od początku do końca", text: "Projekt, kod, baza danych i wdrożenie są w jednych rękach. Nie koordynujesz kilku wykonawców." },
  { title: "Widzisz postępy", text: "Dostajesz wersje do sprawdzenia, zanim projekt będzie gotowy, i masz wpływ na każdą ważną decyzję." },
  { title: "Uczciwie o zakresie", text: "Mówię, czego dana wersja nie obejmuje. Jeśli gotowe narzędzie wystarczy, powiem o tym wprost." },
];

export default async function AboutPage() {
  const projects = await getProjects();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/o-mnie#webpage`,
        url: `${SITE_URL}/o-mnie`,
        name: "O Emanuelu Włochu",
        inLanguage: "pl-PL",
        dateModified: "2026-11-14",
        mainEntity: { "@id": `${SITE_URL}/#emanuel-wloch` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#emanuel-wloch`,
        name: "Emanuel Włoch",
        url: `${SITE_URL}/o-mnie`,
        image: `${SITE_URL}/emanuel_wloch.jpg`,
        jobTitle: "Full-Stack Developer",
        description: "Full-stack developer z Jarosławia. Projektuje i programuje strony internetowe, sklepy, aplikacje webowe z bazą danych oraz programy na Windows.",
        homeLocation: { "@type": "Place", name: "Jarosław, Podkarpackie, Polska" },
        knowsLanguage: ["pl", "en"],
        knowsAbout: ["Strony internetowe", "Sklepy internetowe", "Aplikacje webowe", "Bazy danych", "Programy na Windows", "Next.js", "React", "TypeScript", "C#", ".NET"],
        sameAs: ["https://github.com/xitali", USEME_URL, "https://www.instagram.com/mrmun1o", "https://facebook.com/emanuel.wloch"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "O mnie", item: `${SITE_URL}/o-mnie` },
        ],
      },
    ],
  };

  return (
    <PublicPageShell>
      <main id="main-content" className="portfolio-subpage svc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <article>
          <header className="svc-hero">
            <div className="portfolio-container">
              <nav aria-label="Okruszki" className="svc-crumbs"><ol><li><Link href="/">Strona główna</Link></li><li aria-current="page">O mnie</li></ol></nav>
              <div className="svc-hero-grid about-hero-grid">
                <div className="about-photo"><Image src="/emanuel_wloch.jpg" alt="Emanuel Włoch, full-stack developer z Jarosławia" fill priority sizes="(max-width: 1023px) 80vw, 420px" className="object-cover" /></div>
                <div className="svc-hero-copy">
                  <h1>Emanuel Włoch</h1>
                  <p className="svc-lead">Projektuję i programuję strony, sklepy, aplikacje z bazą danych i programy na Windows. Rozwijam projekty od 2019 roku. Rozmawiasz ze mną i pracujesz ze mną — od pierwszego pomysłu do wdrożenia.</p>
                  <div className="portfolio-actions">
                    <Link href="/#kontakt" className="portfolio-button">Omów projekt <IconArrowUpRight size={17} /></Link>
                    <a href="https://github.com/xitali" target="_blank" rel="me noopener noreferrer" className="portfolio-text-link"><IconGithub size={16} /> GitHub <IconArrowUpRight size={15} /></a>
                  </div>
                  <p className="about-location"><IconPin size={14} /> Jarosław, Podkarpackie · współpraca zdalna w całej Polsce</p>
                </div>
              </div>
            </div>
          </header>

          <section className="svc-section portfolio-container" aria-labelledby="areas-heading">
            <header className="svc-heading"><h2 id="areas-heading">Co buduję i gdzie to zobaczysz</h2><p>Przy każdym obszarze są realizacje, które możesz otworzyć i sprawdzić.</p></header>
            <ul className="about-areas" data-stagger>
              {areas.map(({ Icon, title, text, stack, proof }) => {
                const links = proof.map((slug) => bySlug.get(slug)).filter((project) => project !== undefined);
                return <li key={title}>
                  <Icon size={24} />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <p className="about-stack">{stack.join(" · ")}</p>
                    {links.length > 0 && <nav aria-label={`Realizacje: ${title}`} className="svc-related">{links.map((project) => <Link key={project.id} href={getProjectPath(project)}>{project.title.split(/\s[—–-]\s/)[0]}</Link>)}</nav>}
                  </div>
                </li>;
              })}
            </ul>
          </section>

          <section className="svc-band" aria-labelledby="approach-heading">
            <div className="portfolio-container">
              <h2 id="approach-heading">Jak pracuję</h2>
              <ol className="svc-process" data-stagger>
                {principles.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}
              </ol>
            </div>
          </section>

          <section className="svc-section portfolio-container" aria-labelledby="profiles-heading">
            <header className="svc-heading"><h2 id="profiles-heading">Sprawdź mnie także poza tą stroną</h2></header>
            <ul className="about-profiles">
              <li><a href="https://github.com/xitali" target="_blank" rel="me noopener noreferrer"><strong>GitHub</strong><span>Kod i projekty, nad którymi pracuję.</span><IconArrowUpRight size={18} /></a></li>
              <li><a href={USEME_URL} target="_blank" rel="me noopener noreferrer"><strong>Useme</strong><span>Zewnętrzny profil wykonawcy ze specjalizacją i lokalizacją.</span><IconArrowUpRight size={18} /></a></li>
              <li><Link href="/realizacje"><strong>Realizacje</strong><span>Wszystkie projekty z opisem problemu i rozwiązania.</span><IconArrowUpRight size={18} /></Link></li>
            </ul>
          </section>

          <section className="svc-close portfolio-container" aria-labelledby="close-heading">
            <div className="svc-close-card">
              <Image src="/emanuel_wloch.jpg" alt="" width={88} height={88} className="svc-close-photo" />
              <div><h2 id="close-heading">Masz pomysł albo problem do rozwiązania?</h2><p>Napisz kilka zdań. Odpowiem osobiście i podpowiem, od czego zacząć.</p></div>
              <Link href="/#kontakt" className="portfolio-button">Napisz do mnie <IconArrowUpRight size={17} /></Link>
            </div>
          </section>
        </article>
      </main>
    </PublicPageShell>
  );
}
