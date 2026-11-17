import "server-only";

import { SignJWT, importPKCS8 } from "jose";
import { deleteAndroidDeviceByInstallationId, getAndroidDevices } from "@/lib/data/devices";

interface NativeNotificationPayload {
  title: string;
  body: string;
  messageId?: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
}

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

function getFirebaseCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKeyBase64 =
    process.env.FIREBASE_PRIVATE_KEY_BASE64?.trim();

  if (!projectId || !clientEmail || !privateKeyBase64) return null;

  return {
    projectId,
    clientEmail,
    privateKey: Buffer.from(privateKeyBase64, "base64").toString("utf8"),
  };
}

export function isFirebaseConfigured(): boolean {
  return Boolean(getFirebaseCredentials());
}

async function getGoogleAccessToken(): Promise<string> {
  const credentials = getFirebaseCredentials();
  if (!credentials) {
    throw new Error("Brak konfiguracji Firebase po stronie serwera.");
  }

  if (
    cachedAccessToken &&
    cachedAccessToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedAccessToken.value;
  }

  const privateKey = await importPKCS8(credentials.privateKey, "RS256");
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/firebase.messaging",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(credentials.clientEmail)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !result.access_token) {
    throw new Error("Nie udało się uzyskać tokenu serwera Firebase.");
  }

  cachedAccessToken = {
    value: result.access_token,
    expiresAt: Date.now() + (result.expires_in || 3600) * 1000,
  };
  return result.access_token;
}

function responseMarksTokenAsInvalid(body: unknown): boolean {
  const serialized = JSON.stringify(body);
  return (
    serialized.includes("UNREGISTERED") ||
    serialized.includes("registration-token-not-registered")
  );
}

export async function sendNativeAndroidNotification(
  payload: NativeNotificationPayload,
): Promise<{ sent: number; failed: number }> {
  const credentials = getFirebaseCredentials();
  if (!credentials) return { sent: 0, failed: 0 };

  const devices = await getAndroidDevices();
  if (devices.length === 0) return { sent: 0, failed: 0 };

  const accessToken = await getGoogleAccessToken();
  let sent = 0;
  let failed = 0;

  await Promise.all(
    devices.map(async (device) => {
      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(
          credentials.projectId,
        )}/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              fid: device.installation_id,
              data: {
                type: "contact_message",
                title: payload.title,
                body: payload.body,
                messageId: payload.messageId || "",
              },
              android: {
                priority: "high",
                ttl: "86400s",
              },
            },
          }),
          cache: "no-store",
        },
      );

      if (response.ok) {
        sent += 1;
        return;
      }

      failed += 1;
      const errorBody = await response.json().catch(() => null);
      if (responseMarksTokenAsInvalid(errorBody)) {
        await deleteAndroidDeviceByInstallationId(device.installation_id);
        return;
      }

      console.error("FCM odrzucił powiadomienie.", {
        status: response.status,
      });
    }),
  );

  return { sent, failed };
}

export async function notifyAndroidAboutContactMessage(messageId: string) {
  return sendNativeAndroidNotification({
    title: "Nowa wiadomość z portfolio",
    body: "Dotknij, aby otworzyć Emanuel Admin.",
    messageId,
  });
}
