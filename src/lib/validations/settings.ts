import { z } from "zod";

export const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["he", "en", "ar"]),
  fontSize: z.enum(["small", "medium", "large"]),
  compactMode: z.boolean(),
  currency: z.string().min(1).max(10),
});

export const notificationsSchema = z.object({
  email: z.object({
    orderUpdates: z.boolean(),
    marketing: z.boolean(),
    newsletter: z.boolean(),
  }),
  browser: z.object({
    orderUpdates: z.boolean(),
    promotions: z.boolean(),
  }),
  sms: z.object({
    orderUpdates: z.boolean(),
    promotions: z.boolean(),
    phone: z.string().max(30),
  }),
});

export const permissionsPatchSchema = z
  .object({
    canSell: z.boolean().optional(),
    canManageUsers: z.boolean().optional(),
    canManageProducts: z.boolean().optional(),
    canViewAnalytics: z.boolean().optional(),
    canExportData: z.boolean().optional(),
    twoFactorEnabled: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one permission is required",
  });

export const updateRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
});
