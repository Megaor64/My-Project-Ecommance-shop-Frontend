import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(5000).optional().default(""),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  category: z.string().max(200).optional().default(""),
  stock: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.boolean().default(true),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
