import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, { message: "نام باید حداقل ۳ کاراکتر باشد." }).trim(),
  email: z
    .string()
    .email({ message: "ایمیل نامعتبر است." })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "ایمیل نامعتبر است." })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." }),
});

export type LoginInput = z.infer<typeof loginSchema>;