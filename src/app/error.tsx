"use client";
import {useEffect} from "react";
import Link from "next/link";
import PublicPageShell from "@/components/portfolio/PublicPageShell";
export default function Error({error,reset}: {error: Error & {digest?: string};reset:()=>void}) {
  useEffect(()=>{console.error("Application error:",error);},[error]);
  return <PublicPageShell><main id="main-content" className="portfolio-subpage portfolio-status"><h1>Spróbujmy jeszcze raz.</h1><p>Nie udało się załadować strony. Spróbuj ponownie lub wróć na stronę główną.</p><div className="portfolio-actions"><button onClick={reset} className="portfolio-button">Spróbuj ponownie</button><Link href="/" className="portfolio-button portfolio-button--secondary">Strona główna</Link></div></main></PublicPageShell>;
}
