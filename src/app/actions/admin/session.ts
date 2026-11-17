"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateAdmin } from "@/lib/data/admin-credentials";
import { createAdminSession, logoutAdminSession } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";

export async function loginAdminAction(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length < 8 || password.length > 200) {
    return { success: false, error: "Wprowadź hasło administratora." };
  }

  const headersList = await headers();
  const rateLimit = await checkRateLimit({
    namespace: "admin-login",
    identifier: getClientIp(headersList),
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Zbyt wiele prób. Spróbuj ponownie za około ${Math.ceil(
        rateLimit.retryAfter / 60,
      )} min.`,
    };
  }

  const credential = await authenticateAdmin(password);
  if (!credential) {
    return { success: false, error: "Nieprawidłowe hasło administratora." };
  }

  await createAdminSession(credential);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await logoutAdminSession();
  redirect("/admin/login");
}
