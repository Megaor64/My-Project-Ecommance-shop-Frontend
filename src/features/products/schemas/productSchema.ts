import { z } from "zod";
import type { Translator } from "@/lib/i18n";

export function createProductFormSchema(t: Translator) {
  return z.object({
    name: z.string().min(2, t("admin.products.nameMin")).max(200),
    description: z.string().max(5000).optional().default(""),
    price: z.coerce.number().min(0, t("admin.products.priceMin")),
    category: z.string().max(200).optional().default(""),
    stock: z.coerce.number().int().min(0).optional().default(0),
    isActive: z.boolean().default(true),
  });
}

export type ProductFormInput = z.infer<ReturnType<typeof createProductFormSchema>>;
