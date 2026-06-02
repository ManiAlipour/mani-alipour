import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "نام باید حداقل ۳ کاراکتر باشد" })
    .trim()
    .optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8, { message: "رمز جدید حداقل ۸ کاراکتر" }).optional(),
});

export const createUserCommentSchema = z.object({
  postId: z.string().min(1, { message: "شناسه مقاله الزامی است" }),
  content: z
    .string()
    .min(3, { message: "متن نظر حداقل ۳ کاراکتر" })
    .max(2000)
    .trim(),
});
