import { verifyMobileAdminToken } from "@/lib/server/auth";
import {
  isFirebaseConfigured,
  sendNativeAndroidNotification,
} from "@/lib/notifications/firebase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (
    !(await verifyMobileAdminToken(request.headers.get("authorization")))
  ) {
    return Response.json(
      { success: false, error: "Sesja wygasła." },
      { status: 401 },
    );
  }

  if (!isFirebaseConfigured()) {
    return Response.json(
      { success: false, error: "Firebase nie jest skonfigurowany." },
      { status: 503 },
    );
  }

  const result = await sendNativeAndroidNotification({
    title: "Emanuel Admin działa",
    body: "Natywne powiadomienia są poprawnie skonfigurowane.",
  });

  if (result.sent === 0) {
    return Response.json(
      { success: false, error: "Brak zarejestrowanego telefonu." },
      { status: 409 },
    );
  }

  return Response.json({ success: true, sent: result.sent });
}
