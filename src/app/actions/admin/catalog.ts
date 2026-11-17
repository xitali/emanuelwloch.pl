"use server";

import { revalidatePath, updateTag } from "next/cache";
import { updateServicePrice } from "@/lib/data/services";
import { addTestimonial, deleteTestimonial } from "@/lib/data/testimonials";
import { requireAdmin } from "@/lib/server/auth";
import { idSchema, servicePriceSchema, testimonialSchema } from "@/lib/validation";

export async function updateServicePriceAction(id: string, priceFrom: number) {
  await requireAdmin();
  const data = servicePriceSchema.parse({ id, price: priceFrom });
  await updateServicePrice(data.id, data.price);
  updateTag("services");
  revalidatePath("/uslugi");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function createTestimonialAction(formData: FormData) {
  await requireAdmin();
  const validation = testimonialSchema.safeParse({
    client_name: formData.get("client_name"),
    company: formData.get("company"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  });
  if (!validation.success) {
    return { success: false, error: "Sprawdź dane opinii." };
  }

  await addTestimonial(validation.data);

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonialAction(id: string) {
  await requireAdmin();
  await deleteTestimonial(idSchema.parse(id));
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
