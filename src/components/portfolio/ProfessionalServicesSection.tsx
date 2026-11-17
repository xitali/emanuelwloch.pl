"use client";

import { useState } from "react";
import ServicesArtwork from "@/components/portfolio/ServicesArtwork";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Check,
  Code2,
  Globe2,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { openContactForm } from "@/lib/contact/prefill";
import type { Service } from "@/types";

interface ServicesSectionProps {
  initialServices: Service[];
  sectionId?: string;
}

const projectTypes = [
  { id: "landing", label: "Strona firmowa", base: 600 },
  { id: "ecommerce", label: "E-commerce", base: 1800 },
  { id: "webapp", label: "Aplikacja webowa", base: 1200 },
] as const;

const extraModules = [
  {
    id: "cms",
    label: "Panel CMS",
    description: "Samodzielnie zmieniasz treści",
    price: 300,
  },
  {
    id: "payments",
    label: "Płatności online",
    description: "Stripe, PayU lub Przelewy24",
    price: 500,
  },
  {
    id: "mobile",
    label: "Aplikacja mobilna",
    description: "Dedykowany interfejs Android",
    price: 1000,
  },
] as const;

type ProjectType = (typeof projectTypes)[number]["id"];
type ExtraModule = (typeof extraModules)[number]["id"];

function getServiceIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "globe":
    case "code":
      return Globe2;
    case "smartphone":
      return Smartphone;
    case "star":
      return Star;
    case "shield":
      return Shield;
    case "zap":
      return Zap;
    case "users":
      return Users;
    default:
      return Code2;
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pl-PL").format(value);
}

export default function ProfessionalServicesSection({
  initialServices,
  sectionId = "uslugi",
}: ServicesSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [projectType, setProjectType] = useState<ProjectType>("landing");
  const [selectedModules, setSelectedModules] = useState<Set<ExtraModule>>(
    new Set(["cms"]),
  );

  const activeProject =
    projectTypes.find((item) => item.id === projectType) ?? projectTypes[0];
  const estimate =
    activeProject.base +
    extraModules.reduce(
      (total, module) =>
        total + (selectedModules.has(module.id) ? module.price : 0),
      0,
    );

  function toggleModule(id: ExtraModule) {
    setSelectedModules((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectService(service: Service) {
    openContactForm({
      subject: `Zapytanie o usługę: ${service.name}`,
      message: `Dzień dobry,\n\nJestem zainteresowany/a usługą „${service.name}” (cena od ${formatPrice(service.starting_price)} ${service.currency} netto). Proszę o kontakt w celu omówienia szczegółów.\n\nOpis mojego projektu / dodatkowe wymagania:\n- `,
      badge: "Wybrana usługa została wpisana w formularzu.",
    });
  }

  function selectEstimate() {
    const modules = extraModules
      .filter((module) => selectedModules.has(module.id))
      .map((module) => module.label)
      .join(", ");

    openContactForm({
      subject: `Wycena projektu: ${activeProject.label} (~${formatPrice(estimate)} PLN netto)`,
      message: `Dzień dobry,\n\nInteresuje mnie projekt typu „${activeProject.label}”.\nWybrane moduły: ${modules || "bez dodatkowych modułów"}.\nOrientacyjny budżet: około ${formatPrice(estimate)} PLN netto.\n\nProszę o bezpłatną konsultację i dokładną wycenę.\n\nOpis moich potrzeb:\n- `,
      badge: "Parametry wyceny zostały wpisane w formularzu.",
    });
  }

  return (
    <section
      id={sectionId}
      aria-labelledby="services-heading"
      className="relative z-10 overflow-hidden border-t border-[var(--p-border)] bg-[var(--p-surface)] py-24 text-[var(--p-muted)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:text-white lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute left-[-16rem] top-[22rem] size-[34rem] rounded-[var(--p-radius)] bg-[var(--p-surface)] blur-[150px]"
      />

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <header className="grid gap-8 border-b border-[var(--p-border)] pb-12 dark:border-[var(--p-border)] lg:grid-cols-[0.9fr_0.7fr] lg:items-end lg:gap-20 lg:pb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--p-accent)] dark:text-[var(--p-accent)]">
              <Sparkles className="size-3.5" />
              Projekt, kod i wdrożenie
            </div>
            <h2
              id="services-heading"
              className="mt-5 max-w-4xl text-[clamp(2.85rem,5.5vw,5.75rem)] font-medium leading-[0.88] tracking-[-0.055em]"
            >
              Wybierz, czego{" "}
              <span className="block text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                potrzebujesz.
              </span>
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-base leading-relaxed text-[var(--p-muted)] dark:text-[var(--p-muted)] sm:text-lg">
              Powiedz mi, co chcesz zrobić. Zaproponuję Ci zakres prac,
              przygotuję projekt i uruchomię gotowe rozwiązanie.
              Wycena poniżej pomoże Ci zaplanować budżet.
            </p>
            <Link
              href="/uslugi"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--p-accent)] transition-colors hover:text-[var(--p-accent)] dark:text-[var(--p-accent)] dark:hover:text-[var(--p-accent)]"
            >
              Pełna oferta i odpowiedzi na pytania
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        <div className="mt-12 grid items-start gap-4 lg:mt-16 lg:grid-cols-[0.68fr_1.32fr] lg:gap-5">
          <motion.aside
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
            className="relative min-h-[430px] overflow-hidden rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] text-white shadow-[0_38px_100px_-50px_rgba(15,23,42,.8)] lg:sticky lg:top-24 lg:min-h-[560px]"
          >
            <ServicesArtwork />
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--p-muted)]">
              <span>Od Twojego pomysłu do gotowej strony</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-[var(--p-radius)] bg-[var(--p-surface)]" />
                Dostępny
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
              <p className="max-w-sm text-sm leading-relaxed text-[var(--p-muted)]">
                Na każdym etapie zobaczysz postępy i zdecydujesz, co wymaga dopracowania.
              </p>
            </div>
          </motion.aside>

          <div className="space-y-3">
            {initialServices.map((service, index) => {
              const Icon = getServiceIcon(service.icon_name);
              const features = service.included_features?.slice(0, 3) ?? [];

              return (
                <motion.article
                  key={service.id}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 22 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.55,
                    delay: shouldReduceMotion ? 0 : index * 0.06,
                  }}
                  className="group relative overflow-hidden rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0_22px_60px_-45px_rgba(15,23,42,.5)] transition-colors hover:border-[var(--p-border)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:shadow-none dark:hover:border-[var(--p-border)] sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-20 size-44 rounded-[var(--p-radius)] bg-gradient-to-br from-[#acd1e81a] to-[#7fb4d61a] blur-3xl transition-transform duration-700 group-hover:scale-125"
                  />

                  <div className="relative grid gap-6 sm:grid-cols-[3.25rem_1fr] xl:grid-cols-[3.25rem_1fr_auto] xl:items-start">
                    <div className="grid size-12 place-items-center rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-accent)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:text-[var(--p-accent)]">
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                          0{index + 1}
                        </span>
                        <span className="h-px w-8 bg-[var(--p-surface)] dark:bg-[var(--p-surface)]" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[var(--p-accent)] dark:text-[var(--p-accent)]">
                          Usługa
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-[1.7rem]">
                        {service.name}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                        {service.full_description ||
                          service.short_description}
                      </p>

                      {features.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {features.map((feature) => (
                            <span
                              key={feature}
                              className="inline-flex items-center gap-1.5 rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[10px] text-[var(--p-muted)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:text-[var(--p-muted)]"
                            >
                              <Check className="size-3 text-[var(--p-accent)] dark:text-[var(--p-accent)]" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between border-t border-[var(--p-border)] pt-5 dark:border-[var(--p-border)] sm:col-start-2 xl:col-start-auto xl:flex-col xl:items-end xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
                      <div className="xl:text-right">
                        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                          Cena od
                        </div>
                        <div className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                          {formatPrice(service.starting_price)}{" "}
                          <span className="text-xs font-medium text-[var(--p-accent)] dark:text-[var(--p-accent)]">
                            {service.currency} netto
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectService(service)}
                        className="portfolio-button portfolio-button--secondary mt-4"
                      >
                        Zapytaj
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_34px_90px_-58px_rgba(15,23,42,.6)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:shadow-none lg:mt-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-[var(--p-radius)] border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-accent)] dark:border-[var(--p-border)] dark:bg-[var(--p-surface)] dark:text-[var(--p-accent)]">
                  <Calculator className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">
                    Szybka wycena projektu
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                    Wybierz zakres — wynik aktualizuje się automatycznie.
                  </p>
                </div>
              </div>

              <fieldset className="mt-8">
                <legend className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                  Typ projektu
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      aria-pressed={projectType === type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`min-h-12 rounded-xl border px-3 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#acd1e8] ${
                        projectType === type.id
                          ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 dark:border-white/10 dark:bg-white/[0.025] dark:text-white/52 dark:hover:border-white/25"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-7">
                <legend className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                  Dodatkowe moduły
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {extraModules.map((module) => {
                    const selected = selectedModules.has(module.id);
                    return (
                      <label
                        key={module.id}
                        className={`relative cursor-pointer rounded-xl border p-4 transition-colors ${
                          selected
                            ? "border-[#acd1e880] bg-[#acd1e814] dark:border-[#acd1e84d] dark:bg-[#acd1e812]"
                            : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.025]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleModule(module.id)}
                          className="sr-only"
                        />
                        <span className="flex items-start justify-between gap-3">
                          <span>
                            <span className="block text-xs font-semibold">
                              {module.label}
                            </span>
                            <span className="mt-1 block text-[10px] leading-relaxed text-[var(--p-muted)] dark:text-[var(--p-muted)]">
                              {module.description}
                            </span>
                          </span>
                          <span
                            className={`grid size-5 shrink-0 place-items-center rounded-md border ${
                              selected
                                ? "border-[#acd1e8] bg-[#acd1e8] text-[#0b0d0f]"
                                : "border-slate-300 dark:border-white/20"
                            }`}
                          >
                            {selected && <Check className="size-3" />}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden border-t border-[var(--p-border)] bg-[var(--p-surface)] p-7 text-white sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 size-72 rounded-[var(--p-radius)] bg-gradient-to-br from-[#acd1e833] to-[#7fb4d62e] blur-[90px]"
              />
              <div className="relative">
                <div className="font-mono text-[9px] uppercase tracking-[0.19em] text-[var(--p-accent)]">
                  Orientacyjny budżet
                </div>
                <div
                  role="status"
                  aria-live="polite"
                  aria-label={`Orientacyjny budżet: około ${formatPrice(estimate)} PLN netto`}
                  className="mt-4 flex items-baseline gap-2 tracking-[-0.055em]"
                >
                  <span className="text-3xl text-[var(--p-muted)]">~</span>
                  <span aria-hidden="true">
                    <NumberFlow
                      value={estimate}
                      locales="pl-PL"
                      className="text-[clamp(3.2rem,6vw,5.75rem)] font-medium leading-none"
                    />
                  </span>
                  <span className="text-sm font-medium tracking-normal text-[var(--p-accent)]">
                    PLN netto
                  </span>
                </div>
                <p className="mt-5 max-w-sm text-xs leading-relaxed text-[var(--p-muted)]">
                  To punkt startowy, nie automatyczna oferta. Dokładną cenę
                  podaję po krótkiej rozmowie i poznaniu zakresu.
                </p>
              </div>

              <button
                type="button"
                onClick={selectEstimate}
                className="portfolio-button mt-10"
              >
                Wyślij ten zakres
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
