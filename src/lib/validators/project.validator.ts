import * as yup from "yup";
import type { ProjectStatus } from "@/models/Projects";

// Valid values for ProjectStatus from the schema
const validStatuses: ProjectStatus[] = [
  "planned",
  "in-progress",
  "done",
  "archived",
];

export const projectValidator = yup.object({
  title: yup
    .string()
    .required("عنوان پروژه الزامی است")
    .min(3, "عنوان پروژه باید حداقل ۳ کاراکتر باشد")
    .trim(),
  slug: yup
    .string()
    .required("اسلاگ پروژه الزامی است")
    .matches(
      /^[a-z0-9-]+$/,
      "اسلاگ معتبر وارد کنید (حروف کوچک، عدد، خط تیره)"
    )
    .trim()
    .lowercase(),
  shortDescription: yup.string().trim().notRequired(),
  description: yup
    .string()
    .required("توضیحات پروژه الزامی است")
    .trim(),
  status: yup
    .mixed<ProjectStatus>()
    .oneOf(validStatuses, "وضعیت پروژه معتبر نیست")
    .default("done"),
  techStack: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(1, "مقدار استک تکنولوژی نباید خالی باشد")
    )
    .default([]),
  githubUrl: yup.string().trim().url("آدرس گیت‌هاب نامعتبر است").notRequired(),
  demoUrl: yup.string().trim().url("آدرس دمو نامعتبر است").notRequired(),
  coverImage: yup.string().trim().notRequired(),
  gallery: yup
    .array()
    .of(yup.string().trim())
    .default([]),
  featured: yup.boolean().default(false),
  order: yup
    .number()
    .integer("ترتیب پروژه باید یک عدد باشد")
    .default(0)
    .notRequired(),
  isPublished: yup.boolean().default(true),
});