import { verifyMobileAdminToken } from "@/lib/server/auth";
import {
  deleteAndroidDevice,
  upsertAndroidDevice,
} from "@/lib/server/turso";
import { androidDeviceSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function isAuthorized(request: Request) {
  return verifyMobileAdminToken(request.headers.get("authorization"));
}

export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return Response.json(
      { success: false, error: "Sesja wygasła." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Nieprawidłowe dane." },
      { status: 400 },
    );
  }

  const validation = androidDeviceSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { success: false, error: "Nieprawidłowe dane urządzenia." },
      { status: 400 },
    );
  }

  await upsertAndroidDevice({
    device_id: validation.data.deviceId,
    installation_id: validation.data.installationId,
  });
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthorized(request))) {
    return Response.json(
      { success: false, error: "Sesja wygasła." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Nieprawidłowe dane." },
      { status: 400 },
    );
  }

  const deviceId =
    typeof body === "object" &&
    body !== null &&
    "deviceId" in body &&
    typeof body.deviceId === "string"
      ? body.deviceId
      : "";

  const validation = androidDeviceSchema.shape.deviceId.safeParse(deviceId);
  if (!validation.success) {
    return Response.json(
      { success: false, error: "Nieprawidłowe urządzenie." },
      { status: 400 },
    );
  }

  await deleteAndroidDevice(validation.data);
  return Response.json({ success: true });
}
