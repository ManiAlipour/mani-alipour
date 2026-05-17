import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(5, "عنوان باید حداقل 5 کاراکتر باشد").max(150),

  slug: z
    .string()
    .min(5)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug فقط می‌تواند شامل حروف کوچک، عدد و - باشد"),

  content: z.string().min(50, "محتوا خیلی کوتاه است"),
  excerpt: z.string(),

  cover: z.string().url().optional(),

  readTime: z.number().min(1).max(60).optional(),

  tags: z.array(z.string()).optional(),

  isPublished: z.boolean().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
