import { verifyMobileAdminToken } from "@/lib/server/auth";
import { deleteContactMessage, getContactMessages } from "@/lib/data/messages";
import { mobileMessageDeleteSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function isAuthorized(request: Request) {
  return verifyMobileAdminToken(request.headers.get("authorization"));
}

export async function GET(request: Request) {
  if (!(await isAuthorized(request))) {
    return Response.json(
      { success: false, error: "Sesja wygasła." },
      { status: 401 },
    );
  }

  const messages = await getContactMessages();
  return Response.json(
    { success: true, messages },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
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

  const validation = mobileMessageDeleteSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { success: false, error: "Nieprawidłowy identyfikator wiadomości." },
      { status: 400 },
    );
  }

  await deleteContactMessage(validation.data.id);
  return Response.json({ success: true });
}
