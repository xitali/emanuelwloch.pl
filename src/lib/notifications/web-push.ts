import "server-only";

import webpush from "web-push";
import { deletePushSubscription, getPushSubscriptions } from "@/lib/data/devices";

interface AdminPushPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

let configuredVapidKey: string | null = null;

function configureWebPush(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject =
    process.env.VAPID_SUBJECT?.trim() || "mailto:kontakt@emanuelwloch.pl";

  if (!publicKey || !privateKey) return false;

  if (configuredVapidKey !== publicKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    configuredVapidKey = publicKey;
  }

  return true;
}

export function isWebPushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() &&
      process.env.VAPID_PRIVATE_KEY?.trim(),
  );
}

export async function sendAdminPushNotification(
  payload: AdminPushPayload,
): Promise<{ sent: number; failed: number }> {
  if (!configureWebPush()) {
    return { sent: 0, failed: 0 };
  }

  const subscriptions = await getPushSubscriptions();
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify({
            ...payload,
            icon: "/android-chrome-192x192.png",
            badge: "/favicon-48x48.png",
          }),
          {
            TTL: 24 * 60 * 60,
            urgency: "high",
          },
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          typeof error.statusCode === "number"
            ? error.statusCode
            : null;

        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(subscription.endpoint);
          return;
        }

        console.error(
          "Nie udało się wysłać powiadomienia Web Push.",
          statusCode ? { statusCode } : undefined,
        );
      }
    }),
  );

  return { sent, failed };
}

export async function notifyAboutContactMessage(data: { id: string }) {
  return sendAdminPushNotification({
    title: "Nowa wiadomość z portfolio",
    body: "Otwórz Emanuel Admin, aby przeczytać wiadomość.",
    url: `/admin?tab=messages&message=${encodeURIComponent(data.id)}`,
    tag: `contact-${data.id}`,
  });
}
