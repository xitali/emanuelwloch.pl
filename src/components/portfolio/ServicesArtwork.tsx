import { ArrowDownRight } from "lucide-react";

const stages = [
  ["01", "Kierunek", "Cel, zakres i potrzeby użytkowników."],
  ["02", "Projekt i kod", "Interfejs oraz logika aplikacji."],
  ["03", "Weryfikacja", "Testy, dostępność i wydajność."],
  ["04", "Wdrożenie", "Publikacja i przygotowanie do pracy."],
];

export default function ServicesArtwork() {
  return <div className="service-process-art" aria-label="Proces realizacji projektu">
    <div className="service-process-mark" aria-hidden="true">ew<span>/</span><ArrowDownRight /></div>
    <ol>{stages.map(([number, title, description]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol>
  </div>;
}
