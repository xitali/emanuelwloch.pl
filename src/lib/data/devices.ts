/** Devices that receive admin notifications (web push and the Android app). */
import "server-only";
import { turso } from "@/lib/server/turso";
import type { PushSubscriptionRecord, AndroidDeviceRecord } from "@/types";

export async function upsertPushSubscription(
  subscription: PushSubscriptionRecord,
) {
  const now = new Date().toISOString();
  await turso.execute({
    sql: `INSERT INTO push_subscriptions (
            endpoint, p256dh, auth, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(endpoint) DO UPDATE SET
            p256dh = excluded.p256dh,
            auth = excluded.auth,
            updated_at = excluded.updated_at`,
    args: [
      subscription.endpoint,
      subscription.p256dh,
      subscription.auth,
      now,
      now,
    ],
  });
}

export async function getPushSubscriptions(): Promise<
  PushSubscriptionRecord[]
> {
  const result = await turso.execute(
    "SELECT endpoint, p256dh, auth, created_at, updated_at FROM push_subscriptions",
  );

  return result.rows.map((row) => ({
    endpoint: String(row.endpoint),
    p256dh: String(row.p256dh),
    auth: String(row.auth),
    created_at: String(row.created_at || ""),
    updated_at: String(row.updated_at || ""),
  }));
}

export async function deletePushSubscription(endpoint: string) {
  await turso.execute({
    sql: "DELETE FROM push_subscriptions WHERE endpoint = ?",
    args: [endpoint],
  });
}

export async function upsertAndroidDevice(device: AndroidDeviceRecord) {
  const now = new Date().toISOString();
  await turso.batch(
    [
      {
        sql: "DELETE FROM android_devices WHERE installation_id = ? AND device_id <> ?",
        args: [device.installation_id, device.device_id],
      },
      {
        sql: `INSERT INTO android_devices (
                device_id, installation_id, created_at, updated_at
              ) VALUES (?, ?, ?, ?)
              ON CONFLICT(device_id) DO UPDATE SET
                installation_id = excluded.installation_id,
                updated_at = excluded.updated_at`,
        args: [device.device_id, device.installation_id, now, now],
      },
    ],
    "write",
  );
}

export async function getAndroidDevices(): Promise<AndroidDeviceRecord[]> {
  const result = await turso.execute(
    "SELECT device_id, installation_id, created_at, updated_at FROM android_devices",
  );

  return result.rows.map((row) => ({
    device_id: String(row.device_id),
    installation_id: String(row.installation_id),
    created_at: String(row.created_at || ""),
    updated_at: String(row.updated_at || ""),
  }));
}

export async function deleteAndroidDevice(deviceId: string) {
  await turso.execute({
    sql: "DELETE FROM android_devices WHERE device_id = ?",
    args: [deviceId],
  });
}

export async function deleteAndroidDeviceByInstallationId(installationId: string) {
  await turso.execute({
    sql: "DELETE FROM android_devices WHERE installation_id = ?",
    args: [installationId],
  });
}
