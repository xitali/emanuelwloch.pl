"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { updateServicePriceAction } from "@/app/actions/admin/catalog";
import type { Service } from "@/types";
import { useAdmin } from "./AdminContext";

export default function ServicesView({ services }: { services: Service[] }) {
  const { run, busy } = useAdmin();
  const [prices, setPrices] = useState<Record<string, number>>(() => Object.fromEntries(services.map(s => [s.id, s.starting_price])));

  return <section className="admin-view" aria-labelledby="services-title">
    <header className="admin-view-head"><div><h2 id="services-title">Ceny usług</h2><p>Ceny „od” widoczne w sekcji „Pozostałe usługi i orientacyjna wycena”. Podawane netto.</p></div></header>
    <ul className="admin-price-list">{services.map(service => <li key={service.id}>
      <div><strong>{service.name}</strong><small>{service.short_description}</small></div>
      <label htmlFor={`price-${service.id}`} className="sr-only">Cena od dla: {service.name}</label>
      <div className="admin-price-input"><input id={`price-${service.id}`} type="number" min={0} step={50} value={prices[service.id] ?? 0} onChange={event => setPrices({ ...prices, [service.id]: Number(event.target.value) })} /><span>zł netto</span></div>
      <button type="button" className="admin-secondary" disabled={busy} onClick={() => run(() => updateServicePriceAction(service.id, prices[service.id]), `Zapisano cenę: ${service.name}.`)}><Save className="w-4 h-4" /> Zapisz</button>
    </li>)}</ul>
  </section>;
}
