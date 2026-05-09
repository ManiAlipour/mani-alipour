import z from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "تگ باید حداقل ۲ کاراکتر باشد" }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "اسلاگ باید حداقل ۲ کاراکتر باشد" })
    .regex(/^[a-z0-9-]+$/, { message: "اسلاگ باید فقط شامل حروف کوچک لاتین، عدد و – باشد" }),
  description: z
    .string()
    .trim()
    .max(255, { message: "توضیح نباید بیش از ۲۵۵ کاراکتر باشد" })
    .optional(),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "تگ باید حداقل ۲ کاراکتر باشد" })
    .optional(),
  slug: z
    .string()
    .trim()
    .min(2, { message: "اسلاگ باید حداقل ۲ کاراکتر باشد" })
    .regex(/^[a-z0-9-]+$/, { message: "اسلاگ باید فقط شامل حروف کوچک لاتین، عدد و – باشد" })
    .optional(),
  description: z
    .string()
    .trim()
    .max(255, { message: "توضیح نباید بیش از ۲۵۵ کاراکتر باشد" })
    .optional(),
});