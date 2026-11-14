"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface AdminContextValue {
  /** Public demo: nothing is sent to the server. */
  demo: boolean;
  status: string | null;
  busy: boolean;
  notify: (message: string) => void;
  /** Runs a server action, or in demo mode only explains that nothing is saved. Returns false when skipped or failed. */
  run: (action: () => Promise<{ success?: boolean; error?: string } | void>, done: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextValue | null>(null);
const DEMO_NOTICE = "To wersja demo — zmiana nie została zapisana.";

export function AdminProvider({ demo = false, children }: { demo?: boolean; children: ReactNode }) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    setStatus(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(null), 3500);
  }, []);

  const run = useCallback<AdminContextValue["run"]>(async (action, done) => {
    if (demo) { notify(DEMO_NOTICE); return false; }
    setBusy(true);
    try {
      const result = await action();
      if (result && result.success === false) { notify(result.error || "Nie udało się zapisać zmian."); return false; }
      notify(done);
      return true;
    } catch (error) {
      console.error(error);
      notify("Nie udało się zapisać zmian. Spróbuj ponownie.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [demo, notify]);

  return <AdminContext.Provider value={{ demo, status, busy, notify, run }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used inside AdminProvider");
  return value;
}
