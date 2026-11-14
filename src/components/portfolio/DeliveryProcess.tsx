import { IconArrowUpRight } from "./icons";
import { promoFilm } from "@/lib/promo-film";

export default function DeliveryProcess() {
  return <section id="wspolpraca" className="delivery-process portfolio-container" aria-labelledby="delivery-heading">
    <header className="portfolio-section-heading"><div><h2 id="delivery-heading">Wiesz, co powstaje.<br />{" "}<span>I co będzie dalej.</span></h2></div><p>Wiesz, za co płacisz i co otrzymasz.<br />{" "}Na każdym etapie masz wpływ na efekt.</p></header>
    <ol className="service-steps" data-stagger>
      <li><strong>01 / Rozmowa</strong><span>Opowiedz, czym się zajmujesz i co chcesz usprawnić. Razem ustalimy, czy potrzebujesz strony, aplikacji czy programu.</span></li>
      <li><strong>02 / Zakres i wycena</strong><span>Dostaniesz propozycję zakresu, cenę i termin. Zdecydujesz, czy zaczynamy.</span></li>
      <li><strong>03 / Projekt i realizacja</strong><span>Zobaczysz projekt i wersję testową. Powiesz mi, co chcesz dopracować.</span></li>
      <li><strong>04 / Wdrożenie i przekazanie</strong><span>Uruchomię projekt pod Twoją domeną albo na Twoich komputerach i pokażę Ci, jak z niego korzystać.</span></li>
    </ol>
    {promoFilm.src && <figure className="delivery-film"><video controls playsInline preload="none" poster={promoFilm.poster} aria-label="Jak powstaje strona dla Twojej firmy — film, 25 sekund"><source src={promoFilm.src} type="video/mp4" />Twoja przeglądarka nie obsługuje filmu.</video><figcaption>Od celu do działającej strony. Film bez lektora; treść jest widoczna na ekranie.</figcaption><a className="portfolio-text-link" href={promoFilm.verticalSrc} target="_blank" rel="noopener noreferrer">Otwórz film pionowy 9:16 <IconArrowUpRight size={16} /></a><details><summary>Przeczytaj treść filmu</summary><p>Strony i aplikacje dla Twojej firmy. Strony firmowe, sklepy i aplikacje webowe. Od Twojego pomysłu do wdrożenia: cel, projekt, realizacja, wdrożenie. Realizacje: VIP Transfery, Zielona Baza, Solid Print — wersja testowa. „Projekt jest bardzo świeży, nowoczesny, a zarazem ciepły w odbiorze.” — fragment opinii Joanny Michno, Zielona Baza. Twoja firma. Moja realizacja. Emanuel Włoch, emanuelwloch.pl. Omów projekt.</p></details></figure>}
    <div className="portfolio-actions"><a className="portfolio-button" href="#kontakt">Omów projekt <IconArrowUpRight size={18} /></a><p className="process-note">Masz pomysł albo pytanie?<br />{" "}Napisz kilka zdań — pomogę Ci ustalić, od czego zacząć.</p></div>
  </section>;
}
