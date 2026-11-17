"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Bell, BellOff, Download, Send, Smartphone } from "lucide-react";
import { isAndroidPlatform } from "@/lib/platform";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function subscribeToDisplayMode(callback: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", callback);
  window.addEventListener("appinstalled", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
    window.removeEventListener("appinstalled", callback);
  };
}

function getStandaloneSnapshot() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

function getStandaloneServerSnapshot() {
  return false;
}

function subscribeToPlatform() {
  return () => undefined;
}

function getAndroidSnapshot() {
  const navigatorWithUserAgentData = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };

  return isAndroidPlatform(
    navigator.userAgent,
    navigatorWithUserAgentData.userAgentData?.platform,
  );
}

function getAndroidServerSnapshot() {
  return false;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

async function postPushAction(body: unknown) {
  const response = await fetch("/api/admin/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as {
    success?: boolean;
    error?: string;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Nie udało się wykonać operacji.");
  }
}

export default function AdminAppManager() {
  const isAndroid = useSyncExternalStore(
    subscribeToPlatform,
    getAndroidSnapshot,
    getAndroidServerSnapshot,
  );
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isStandalone = useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot,
  );
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    if (!isAndroid) return;

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setStatus("Aplikacja została zainstalowana.");
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    const initializePush = async () => {
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;
      setIsSupported(supported);
      if (!supported) return;

      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const subscription =
          await registration.pushManager.getSubscription();
        setIsSubscribed(Boolean(subscription));

        if (subscription && publicVapidKey) {
          await postPushAction({
            action: "subscribe",
            subscription: subscription.toJSON(),
          });
        }
      } catch (error) {
        console.error("Nie udało się uruchomić aplikacji PWA:", error);
        setStatus("Nie udało się uruchomić obsługi powiadomień.");
      }
    };

    void initializePush();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [isAndroid, publicVapidKey]);

  async function installApp() {
    if (!installPrompt) {
      setStatus(
        "W Chrome wybierz menu ⋮, a następnie „Dodaj do ekranu głównego” lub „Zainstaluj aplikację”.",
      );
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setStatus("Instalowanie aplikacji…");
    }
    setInstallPrompt(null);
  }

  async function enableNotifications() {
    if (!publicVapidKey) {
      setStatus("Serwer nie ma jeszcze klucza powiadomień.");
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(
          "Powiadomienia zostały zablokowane. Zezwól na nie w ustawieniach Chrome.",
        );
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        }));

      await postPushAction({
        action: "subscribe",
        subscription: subscription.toJSON(),
      });
      setIsSubscribed(true);
      setStatus("Powiadomienia są włączone na tym urządzeniu.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Nie udało się włączyć powiadomień.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function disableNotifications() {
    setLoading(true);
    setStatus(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        await registration.pushManager.getSubscription();

      if (subscription) {
        await postPushAction({
          action: "unsubscribe",
          endpoint: subscription.endpoint,
        });
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setStatus("Powiadomienia zostały wyłączone na tym urządzeniu.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Nie udało się wyłączyć powiadomień.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    setLoading(true);
    setStatus(null);
    try {
      await postPushAction({ action: "test" });
      setStatus("Wysłano powiadomienie testowe.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Nie udało się wysłać testu.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isAndroid) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto rounded-[var(--p-radius)] border border-[var(--p-border)]  bg-[#acd1e814]  p-5 sm:p-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-[#acd1e814] ">
            <Smartphone className="w-6 h-6 text-[var(--p-accent)] " />
          </div>
          <div>
            <h2 className="font-bold text-[var(--p-text)] ">
              Emanuel Admin na Androida
            </h2>
            <p className="text-sm text-[var(--p-muted)] ">
              Zainstaluj panel na ekranie telefonu i odbieraj powiadomienia o
              nowych wiadomościach.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isStandalone && (
            <button
              type="button"
              onClick={installApp}
              className="px-4 py-2.5 rounded-xl bg-[var(--p-surface)] text-white   text-xs font-semibold flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Zainstaluj aplikację
            </button>
          )}

          {isSupported === true &&
            (isSubscribed ? (
              <>
                <button
                  type="button"
                  onClick={sendTestNotification}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl admin-primary disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Wyślij test
                </button>
                <button
                  type="button"
                  onClick={disableNotifications}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-rose-300  text-rose-700  text-xs font-semibold flex items-center gap-2"
                >
                  <BellOff className="w-4 h-4" />
                  Wyłącz
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={enableNotifications}
                disabled={loading || !publicVapidKey}
                className="px-4 py-2.5 rounded-xl admin-primary disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Włącz powiadomienia
              </button>
            ))}
        </div>
      </div>

      {isSupported === false && (
        <p className="text-sm text-rose-700 ">
          Ta przeglądarka nie obsługuje powiadomień. Otwórz panel w Chrome na
          Androidzie.
        </p>
      )}

      {status && (
        <p
          role="status"
          aria-live="polite"
          className="text-sm text-[var(--p-text)] "
        >
          {status}
        </p>
      )}
    </section>
  );
}
