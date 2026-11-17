"use client";

import { useState } from "react";
import { loginAdminAction } from "@/app/actions/admin/session";
import { ArrowLeft, ArrowUpRight, AlertCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/portfolio/icons";

export default function AdminLoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setErrorMsg(null);
    try {
      const res = await loginAdminAction(new FormData(e.currentTarget));
      if (res && !res.success) setErrorMsg(res.error || "Nie udało się zalogować. Spróbuj ponownie.");
    } finally { setLoading(false); }
  }
  return <main className="admin-login">
    <header className="admin-login-header"><Link href="/" className="admin-brand" aria-label="Emanuel Włoch — strona główna"><BrandMark size={24}/>ew <span>/</span><small>Emanuel Włoch</small></Link><Link href="/" className="admin-back"><ArrowLeft size={15}/> Zobacz stronę</Link></header>
    <div className="admin-login-grid">
      <section className="admin-login-intro"><p className="admin-eyebrow">TWOJE MIEJSCE PRACY</p><h1>Twoja strona.<br/><span>Pod kontrolą.</span></h1><p>Dodawaj realizacje, aktualizuj ofertę i odpowiadaj na wiadomości. Wszystko masz w jednym miejscu.</p><div className="admin-login-index"><span>01 / Realizacje</span><span>02 / Oferta</span><span>03 / Wiadomości</span></div></section>
      <section className="admin-login-card" aria-labelledby="admin-login-title"><LockKeyhole className="admin-login-icon" size={27}/><p className="admin-eyebrow">DOSTĘP ADMINISTRATORA</p><h2 id="admin-login-title">Witaj ponownie.</h2><p>Wpisz swoje hasło, aby otworzyć panel.</p>
        {errorMsg && <div role="alert" className="admin-error"><AlertCircle size={18}/><span>{errorMsg}</span></div>}
        <form onSubmit={handleSubmit}><label htmlFor="admin-password">Twoje hasło</label><input id="admin-password" type="password" name="password" autoComplete="current-password" required placeholder="Wpisz hasło" disabled={loading}/><button type="submit" disabled={loading} className="admin-primary">{loading ? "Logowanie…" : "Otwórz panel"}<ArrowUpRight size={18}/></button></form>
        <p className="admin-login-hint">Nie pamiętasz hasła? Uruchom na swoim komputerze narzędzie „Reset-hasla-admina” w folderze projektu.</p>
      </section>
    </div><footer className="admin-login-footer">EMANUEL WŁOCH <span>STRONY · APLIKACJE · PROGRAMY DLA FIRM</span></footer>
  </main>;
}
