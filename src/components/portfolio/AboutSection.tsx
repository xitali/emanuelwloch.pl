import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight as ArrowUpRight, IconDatabase, IconDesign, IconFrontend, IconRocket } from "./icons";

export default function AboutSection() {
  return <section id="o-mnie" className="portfolio-about portfolio-container" aria-labelledby="about-heading">
    <div className="about-portrait" data-reveal="clip"><Image src="/emanuel_wloch.jpg" alt="Emanuel Włoch" fill sizes="(max-width: 1023px) 80vw, 35vw" className="object-cover object-top" /><span>EMANUEL WŁOCH / JAROSŁAW, PL</span></div>
    <div data-stagger><h2 id="about-heading">Wiesz, z kim<br />{" "}<span>pracujesz.</span></h2><p>Mam na imię Emanuel. Porozmawiasz ze mną o swoim pomyśle, a potem to ja zaprojektuję, zaprogramuję i uruchomię Twoją stronę, aplikację albo program. Działam z Jarosławia i współpracuję zdalnie w całej Polsce.</p><p>Nie musisz znać się na kodzie ani koordynować kilku wykonawców. Wyjaśnię Ci dostępne opcje, pokażę postępy i pomogę podjąć decyzje dotyczące Twojego projektu.</p><div className="about-pills" aria-label="Zakres pracy"><span><IconDesign />Projekt</span><span><IconFrontend />Kod</span><span><IconDatabase />Baza danych</span><span><IconRocket />Wdrożenie</span></div><Link className="portfolio-text-link" href="/o-mnie">Poznaj mnie bliżej <ArrowUpRight size={18} /></Link></div>
  </section>;
}
