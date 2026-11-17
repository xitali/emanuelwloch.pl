import { verifyAdminSession } from "@/lib/server/auth";
import { deletePushSubscription, upsertPushSubscription } from "@/lib/data/devices";
import {
  isWebPushConfigured,
  sendAdminPushNotification,
} from "@/lib/notifications/web-push";
import { pushActionSchema } from "@/lib/validation";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function hasValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return json({ success: false, error: "Brak autoryzacji." }, 401);
  }

  if (!hasValidOrigin(request)) {
    return json({ success: false, error: "Nieprawidłowe źródło żądania." }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Nieprawidłowe dane JSON." }, 400);
  }

  const parsed = pushActionSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        error: parsed.error.issues[0]?.message || "Nieprawidłowe dane.",
      },
      400,
    );
  }

  if (!isWebPushConfigured()) {
    return json(
      {
        success: false,
        error: "Powiadomienia nie zostały jeszcze skonfigurowane na serwerze.",
      },
      503,
    );
  }

  if (parsed.data.action === "subscribe") {
    await upsertPushSubscription({
      endpoint: parsed.data.subscription.endpoint,
      p256dh: parsed.data.subscription.keys.p256dh,
      auth: parsed.data.subscription.keys.auth,
    });
    return json({ success: true });
  }

  if (parsed.data.action === "unsubscribe") {
    await deletePushSubscription(parsed.data.endpoint);
    return json({ success: true });
  }

  const result = await sendAdminPushNotification({
    title: "Powiadomienia działają",
    body: "Aplikacja Emanuel Admin jest gotowa na nowe wiadomości.",
    url: "/admin?tab=messages",
    tag: `push-test-${Date.now()}`,
  });

  if (result.sent === 0) {
    return json(
      {
        success: false,
        error: "Brak aktywnego urządzenia do wysłania testu.",
      },
      409,
    );
  }

  return json({ success: true, sent: result.sent });
}
