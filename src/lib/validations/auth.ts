import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const adminLoginStep1Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const adminLoginOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  remember: z.boolean().optional(),
});

export const adminRegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  adminPass: z.string().min(8),
});

export const googleAuthSchema = z
  .object({
    idToken: z.string().min(10),
    intent: z.enum(["customer", "admin-login", "admin-register"]),
    remember: z.boolean().optional(),
    adminPass: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.intent === "admin-register" && !data.adminPass) {
      ctx.addIssue({
        code: "custom",
        message: "Admin secret is required",
        path: ["adminPass"],
      });
    }
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const inquiryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "read", "replied"]).optional(),
  reply: z.string().min(1).max(5000).optional(),
});
