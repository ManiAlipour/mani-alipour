"use client";

import { useFetch } from "iso-hooks";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UploadButton } from "@/utils/uploadthing";
import toast from "react-hot-toast";

export type IProject = {
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  status: "planned" | "in-progress" | "done" | "archived";
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  featured: boolean;
  order?: number;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type ProjectStatus = "planned" | "in-progress" | "done" | "archived";
type StatusCounts = Partial<Record<ProjectStatus, number>>;

interface IProjectResponse {
  message: string;
  data: IProject[];
  total: number;
  page: number;
  pageSize: number;
}

interface IProjectStatsResponse {
  success: boolean;
  data: IStats;
}

interface IStats {
  totalProjects: number;
  statusCounts: StatusCounts;
  projectsByCategory: any[];
  monthlyStats: any[];
  popularProjects: any[];
  latestProjects: any[];
  recentlyUpdated: any[];
  recentlyFinished: any[];
  avgBlogsPerProject: number | null;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "برنامه‌ریزی",
  "in-progress": "در حال انجام",
  done: "تکمیل شده",
  archived: "آرشیو",
};

const STATUS_BG: Record<ProjectStatus, string> = {
  planned: "bg-yellow-300 text-slate-900",
  "in-progress": "bg-cyan-400 text-slate-900",
  done: "bg-[#00e096] text-slate-900",
  archived: "bg-slate-500 text-white",
};

function KeyStatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 m-1 bg-cyan-950/70 border border-cyan-900 shadow-md rounded-xl min-w-[120px]">
      <span className="text-xl font-extrabold text-neon-blue drop-shadow">
        {value}
      </span>

      <span className="text-xs text-cyan-100 mt-1">{label}</span>
    </div>
  );
}

function Stats({ stats }: { stats: IStats | undefined }) {
  if (!stats) return null;

  return (
    <div className="flex gap-4 mb-8 flex-wrap justify-center">
      <KeyStatBox label="تعداد پروژه‌ها" value={stats.totalProjects ?? "-"} />

      <KeyStatBox
        label="میانگین بلاگ/پروژه"
        value={
          typeof stats.avgBlogsPerProject === "number"
            ? stats.avgBlogsPerProject.toFixed(2)
            : "-"
        }
      />

      <KeyStatBox
        label="تعداد دسته‌بندی"
        value={stats.projectsByCategory?.length ?? "-"}
      />
    </div>
  );
}

// =====================
// Preview Gallery
// =====================

function ImagePreviewGrid({
  urls,
  onRemove,
  title = "تصاویر گالری",
}: {
  urls: string[];
  onRemove?: (index: number) => void;
  title?: string;
}) {
  if (!urls.length) return null;

  return (
    <div className="space-y-2">
      <div className="text-cyan-200 text-sm">{title}</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {urls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative rounded-xl overflow-hidden border border-cyan-900 bg-cyan-950/70"
          >
            <img
              src={url}
              alt={`gallery-${index + 1}`}
              className="w-full h-28 object-cover"
            />

            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 left-2 bg-rose-700 hover:bg-rose-600 text-white text-xs px-2 py-1 rounded transition"
              >
                حذف
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================
// Yup Validation
// =====================

const ProjectFormSchema = Yup.object().shape({
  title: Yup.string().required("عنوان پروژه الزامی است."),

  slug: Yup.string()
    .matches(
      /^[a-zA-Z0-9-]+$/,
      "اسلاگ فقط باید شامل حروف انگلیسی، ارقام و - باشد.",
    )
    .required("اسلاگ الزامی است."),

  description: Yup.string().required("توضیحات الزامی است."),

  status: Yup.mixed<ProjectStatus>()
    .oneOf(["planned", "in-progress", "done", "archived"])
    .required("وضعیت پروژه الزامی است."),

  techStack: Yup.string().required("تکنولوژی‌ها الزامی است."),

  githubUrl: Yup.string()
    .url("آدرس GitHub معتبر نیست.")
    .nullable()
    .notRequired(),

  demoUrl: Yup.string().url("آدرس دمو معتبر نیست.").nullable().notRequired(),

  featured: Yup.boolean(),
  isPublished: Yup.boolean(),

  order: Yup.number().nullable().typeError("شماره ترتیب باید عدد باشد."),
});

// =====================
// فرم ویرایش پروژه
// =====================

function UpdateProjectForm({
  project,
  onClose,
  onUpdate,
}: {
  project: IProject;
  onClose: () => void;
  onUpdate: (p: IProject) => void;
}) {
  const [msg, setMsg] = useState<{ error?: string; succ?: string }>({});
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [gallery, setGallery] = useState<string[]>(project.gallery || []);

  const handleRemoveGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-60 flex items-center justify-center px-2 sm:px-0">
      <Formik
        initialValues={{
          title: project.title || "",
          slug: project.slug || "",
          description: project.description || "",
          status: project.status || "planned",
          techStack: project.techStack?.join(", ") || "",
          githubUrl: project.githubUrl || "",
          demoUrl: project.demoUrl || "",
          featured: project.featured || false,
          isPublished: project.isPublished || false,
          order: project.order?.toString() || "",
        }}
        validationSchema={ProjectFormSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setLoading(true);
          setMsg({});

          try {
            const res = await fetch(
              `/api/projects/${encodeURIComponent(project.slug)}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...values,
                  gallery,
                  techStack: values.techStack
                    .split(",")
                    .map((item: string) => item.trim())
                    .filter(Boolean),
                  order:
                    values.order !== "" && !isNaN(Number(values.order))
                      ? Number(values.order)
                      : undefined,
                }),
              },
            );

            if (!res.ok) {
              throw new Error("ویرایش پروژه با خطا مواجه شد.");
            }

            const data = await res.json();

            onUpdate(data.data);
            setMsg({ succ: "پروژه با موفقیت ویرایش شد." });

            setTimeout(onClose, 900);
          } catch (error: any) {
            setMsg({
              error: error?.message || "خطای ناشناخته رخ داد.",
            });
          } finally {
            setSubmitting(false);
            setLoading(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form
            className="bg-cyan-950/95 border border-cyan-900 shadow-md rounded-2xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5 w-full max-w-lg sm:max-w-3xl relative max-h-[95vh] overflow-y-auto"
            dir="rtl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute left-2 sm:left-3 top-2 rounded bg-slate-800 px-2.5 py-0.5 text-cyan-100 hover:bg-slate-600 text-base sm:text-lg"
            >
              ✖
            </button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Field
                name="title"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded focus:ring-2 focus:ring-neon-blue w-full text-sm sm:text-base"
                placeholder="عنوان پروژه"
                required
              />

              <Field
                name="slug"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded focus:ring-2 focus:ring-neon-blue w-full text-sm sm:text-base"
                placeholder="اسلاگ (انگلیسی)"
                required
                disabled
                title="اسلاگ قابل ویرایش نیست"
              />
            </div>

            <div className="text-red-500 text-xs mt-0.5">
              <ErrorMessage name="title" />
              <ErrorMessage name="slug" />
            </div>

            <Field
              as="textarea"
              name="description"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded focus:ring-2 focus:ring-neon-blue w-full h-20 text-sm sm:text-base"
              placeholder="توضیحات پروژه"
              required
            />

            <div className="text-red-500 text-xs mt-0.5">
              <ErrorMessage name="description" />
            </div>

            <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
              <Field
                as="select"
                name="status"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
              >
                <option value="planned">{STATUS_LABELS.planned}</option>
                <option value="in-progress">
                  {STATUS_LABELS["in-progress"]}
                </option>
                <option value="done">{STATUS_LABELS.done}</option>
                <option value="archived">{STATUS_LABELS.archived}</option>
              </Field>

              <Field
                name="techStack"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
                placeholder="تکنولوژی‌ها (با , جدا کنید)"
              />
            </div>

            <div className="text-red-500 text-xs mt-0.5">
              <ErrorMessage name="status" />
              <ErrorMessage name="techStack" />
            </div>

            <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
              <Field
                name="githubUrl"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
                placeholder="GitHub URL"
              />

              <Field
                name="demoUrl"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
                placeholder="Demo URL"
              />

              <Field
                name="order"
                type="number"
                className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
                placeholder="شماره ترتیب"
              />
            </div>

            <div className="text-red-500 text-xs mt-0.5">
              <ErrorMessage name="githubUrl" />
              <ErrorMessage name="demoUrl" />
              <ErrorMessage name="order" />
            </div>

            {/* Gallery Upload */}
            <div className="flex flex-col gap-3">
              <label className="text-cyan-100 text-sm font-bold">
                گالری تصاویر پروژه
              </label>

              <UploadButton
                endpoint="imageUploader"
                onUploadBegin={() => {
                  setIsUploading(true);
                  toast.loading("در حال آپلود تصاویر...", {
                    id: "project-gallery-upload",
                  });
                }}
                onClientUploadComplete={(res: any) => {
                  const uploadedUrls = (res || [])
                    .map((file: any) => file?.url ?? file?.ufsUrl)
                    .filter(Boolean);

                  if (uploadedUrls.length) {
                    setGallery((prev) => [...prev, ...uploadedUrls]);

                    toast.success("تصاویر با موفقیت آپلود شدند ✅", {
                      id: "project-gallery-upload",
                    });
                  } else {
                    toast.error("آدرس تصویر آپلودشده دریافت نشد.", {
                      id: "project-gallery-upload",
                    });
                  }

                  setIsUploading(false);
                }}
                onUploadError={(error: Error) => {
                  toast.error(`خطا در آپلود: ${error.message}`, {
                    id: "project-gallery-upload",
                  });

                  setIsUploading(false);
                }}
              />

              {isUploading && (
                <div className="text-sm text-neon-blue animate-pulse">
                  تصاویر در حال آپلود هستند...
                </div>
              )}

              <ImagePreviewGrid
                urls={gallery}
                onRemove={handleRemoveGalleryImage}
                title="تصاویر گالری پروژه"
              />
            </div>

            <div className="flex flex-col xs:flex-row gap-3 xs:gap-6 md:gap-8 justify-between items-center">
              <div className="flex items-center gap-2 xs:gap-1 text-cyan-100 text-sm">
                <Field
                  type="checkbox"
                  name="isPublished"
                  checked={values.isPublished}
                  onChange={() =>
                    setFieldValue("isPublished", !values.isPublished)
                  }
                  className="accent-neon-blue"
                />
                <span>منتشر شود</span>
              </div>

              <div className="flex items-center gap-2 xs:gap-1 text-cyan-100 text-sm">
                <Field
                  type="checkbox"
                  name="featured"
                  checked={values.featured}
                  onChange={() => setFieldValue("featured", !values.featured)}
                  className="accent-neon-blue"
                />
                <span>ویژه</span>
              </div>

              <button
                type="submit"
                className="bg-neon-blue hover:bg-cyan-800 text-white font-bold px-4 sm:px-5 py-2 rounded-xl shadow transition disabled:opacity-60 min-w-[100px] sm:min-w-[120px] w-full xs:w-auto mt-2 xs:mt-0"
                disabled={isSubmitting || loading || isUploading}
              >
                {isSubmitting || loading
                  ? "در حال بروزرسانی..."
                  : isUploading
                    ? "در حال آپلود..."
                    : "ذخیره تغییرات"}
              </button>
            </div>

            {msg.error && (
              <div className="text-rose-400 text-sm font-bold">{msg.error}</div>
            )}

            {msg.succ && (
              <div className="text-emerald-400 text-sm font-bold">
                {msg.succ}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

// =====================
// جدول پروژه‌ها
// =====================

function SimpleTable({
  projects,
  onDelete,
  onEdit,
}: {
  projects: IProject[];
  onDelete: (slug: string) => void;
  onEdit: (project: IProject) => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!window.confirm("آیا حذف این پروژه قطعی است؟")) return;

    setDeleting(slug);

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      onDelete(slug);
    } catch {
      alert("خطا در حذف پروژه.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="hidden sm:block overflow-auto rounded-2xl border border-cyan-900 bg-cyan-950/70 backdrop-blur-md shadow mb-10">
        <table className="min-w-full text-sm text-right font-vazir">
          <thead>
            <tr className="bg-gradient-to-l from-cyan-950/80 to-cyan-900/90">
              <th className="py-2 px-3 text-cyan-100">عنوان</th>
              <th className="py-2 px-3 text-cyan-100">وضعیت</th>
              <th className="py-2 px-3 text-cyan-100">منتشر</th>
              <th className="py-2 px-3 text-cyan-100">ویژه</th>
              <th className="py-2 px-3 text-cyan-100">گالری</th>
              <th className="py-2 px-3" />
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.slug}
                className="border-t border-cyan-900/40 even:bg-cyan-900/30 odd:bg-cyan-950/20 hover:bg-cyan-900/50 transition"
              >
                <td className="py-2 px-3 text-cyan-50">{project.title}</td>

                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-lg font-bold shadow-sm ${
                      STATUS_BG[project.status]
                    } text-xs`}
                  >
                    {STATUS_LABELS[project.status]}
                  </span>
                </td>

                <td className="py-2 px-3 text-center">
                  {project.isPublished ? "✅" : "—"}
                </td>

                <td className="py-2 px-3 text-center">
                  {project.featured ? <span title="ویژه">⭐</span> : "—"}
                </td>

                <td className="py-2 px-3 text-center">
                  {project.gallery?.length ?? 0}
                </td>

                <td className="py-2 px-3 text-center flex space-x-1 space-x-reverse gap-1 justify-center">
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="rounded bg-cyan-800/80 hover:bg-neon-blue text-white px-3 py-1 transition ml-1"
                  >
                    ویرایش
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.slug)}
                    className="rounded bg-rose-900/70 hover:bg-rose-700 text-white px-3 py-1 transition disabled:opacity-60"
                    disabled={deleting === project.slug}
                  >
                    {deleting === project.slug ? "..." : "حذف"}
                  </button>
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-7 text-cyan-200">
                  هیچ پروژه‌ای ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4 mb-10">
        {projects.length === 0 && (
          <div className="text-center py-7 text-cyan-200 border border-cyan-900 bg-cyan-950/70 rounded-2xl">
            هیچ پروژه‌ای ثبت نشده است.
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.slug}
            className="border border-cyan-900 bg-cyan-950/70 rounded-2xl shadow px-3 py-3 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-neon-blue text-base">
                {project.title}
              </div>

              <span
                className={`px-2 py-0.5 rounded-lg font-bold shadow-sm ${
                  STATUS_BG[project.status]
                } text-xs whitespace-nowrap ml-1`}
              >
                {STATUS_LABELS[project.status]}
              </span>
            </div>

            <div className="flex items-center gap-2 justify-start flex-wrap">
              <span className="text-xs text-cyan-300">
                {project.isPublished ? "منتشرشده" : "منتشرنشده"}
              </span>

              <span className="text-xs text-yellow-400">
                {project.featured ? "⭐ ویژه" : ""}
              </span>

              <span className="text-xs text-cyan-300">
                گالری: {project.gallery?.length ?? 0}
              </span>
            </div>

            <div className="flex gap-2 justify-between mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="rounded bg-cyan-800/80 hover:bg-neon-blue text-white px-3 py-1 transition text-sm"
              >
                ویرایش
              </button>

              <button
                type="button"
                onClick={() => handleDelete(project.slug)}
                className="rounded bg-rose-900/70 hover:bg-rose-700 text-white px-3 py-1 transition disabled:opacity-60 text-sm"
                disabled={deleting === project.slug}
              >
                {deleting === project.slug ? "..." : "حذف"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// =====================
// فرم افزودن پروژه
// =====================

function AddProjectForm({ onAdd }: { onAdd: (p: IProject) => void }) {
  const [msg, setMsg] = useState<{ error?: string; succ?: string }>({});
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);

  const handleRemoveGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Formik
      initialValues={{
        title: "",
        slug: "",
        description: "",
        status: "planned" as ProjectStatus,
        techStack: "",
        githubUrl: "",
        demoUrl: "",
        featured: false,
        isPublished: false,
        order: "",
      }}
      validationSchema={ProjectFormSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        setLoading(true);
        setMsg({});

        try {
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              gallery,
              techStack: values.techStack
                .split(",")
                .map((item: string) => item.trim())
                .filter(Boolean),
              order:
                values.order !== "" && !isNaN(Number(values.order))
                  ? Number(values.order)
                  : undefined,
            }),
          });

          if (!res.ok) {
            throw new Error("ثبت پروژه با خطا مواجه شد.");
          }

          const data = await res.json();

          onAdd(data.data);
          resetForm();
          setGallery([]);
          setMsg({ succ: "پروژه اضافه شد." });
        } catch (error: any) {
          setMsg({
            error: error?.message || "خطای ناشناخته رخ داد.",
          });
        } finally {
          setSubmitting(false);
          setLoading(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form
          className="bg-cyan-950/70 border border-cyan-900 shadow-md rounded-2xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5 mb-10 max-w-full sm:max-w-3xl mx-auto w-full"
          dir="rtl"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Field
              name="title"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded focus:ring-2 focus:ring-neon-blue w-full text-sm sm:text-base"
              placeholder="عنوان پروژه"
              required
            />

            <Field
              name="slug"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded focus:ring-2 focus:ring-neon-blue w-full text-sm sm:text-base"
              placeholder="اسلاگ (انگلیسی)"
              required
            />
          </div>

          <div className="text-red-500 text-xs mt-0.5">
            <ErrorMessage name="title" />
            <ErrorMessage name="slug" />
          </div>

          <Field
            as="textarea"
            name="description"
            className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded focus:ring-2 focus:ring-neon-blue w-full h-20 text-sm sm:text-base"
            placeholder="توضیحات پروژه"
            required
          />

          <div className="text-red-500 text-xs mt-0.5">
            <ErrorMessage name="description" />
          </div>

          <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
            <Field
              as="select"
              name="status"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
            >
              <option value="planned">{STATUS_LABELS.planned}</option>
              <option value="in-progress">
                {STATUS_LABELS["in-progress"]}
              </option>
              <option value="done">{STATUS_LABELS.done}</option>
              <option value="archived">{STATUS_LABELS.archived}</option>
            </Field>

            <Field
              name="techStack"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
              placeholder="تکنولوژی‌ها (با , جدا کنید)"
            />
          </div>

          <div className="text-red-500 text-xs mt-0.5">
            <ErrorMessage name="status" />
            <ErrorMessage name="techStack" />
          </div>

          <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
            <Field
              name="githubUrl"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
              placeholder="GitHub URL"
            />

            <Field
              name="demoUrl"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
              placeholder="Demo URL"
            />

            <Field
              name="order"
              type="number"
              className="border border-cyan-800 bg-cyan-900/40 text-cyan-100 px-2 py-1.5 sm:px-3 rounded w-full text-sm sm:text-base"
              placeholder="شماره ترتیب"
            />
          </div>

          <div className="text-red-500 text-xs mt-0.5">
            <ErrorMessage name="githubUrl" />
            <ErrorMessage name="demoUrl" />
            <ErrorMessage name="order" />
          </div>

          {/* Gallery Upload */}
          <div className="flex flex-col gap-3">
            <label className="text-cyan-100 text-sm font-bold">
              گالری تصاویر پروژه
            </label>

            <UploadButton
              endpoint="imageUploader"
              onUploadBegin={() => {
                setIsUploading(true);

                toast.loading("در حال آپلود تصاویر...", {
                  id: "project-gallery-upload",
                });
              }}
              onClientUploadComplete={(res: any) => {
                const uploadedUrls = (res || [])
                  .map((file: any) => file?.url ?? file?.ufsUrl)
                  .filter(Boolean);

                if (uploadedUrls.length) {
                  setGallery((prev) => [...prev, ...uploadedUrls]);

                  toast.success("تصاویر با موفقیت آپلود شدند ✅", {
                    id: "project-gallery-upload",
                  });
                } else {
                  toast.error("آدرس تصویر آپلودشده دریافت نشد.", {
                    id: "project-gallery-upload",
                  });
                }

                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                toast.error(`خطا در آپلود: ${error.message}`, {
                  id: "project-gallery-upload",
                });

                setIsUploading(false);
              }}
            />

            {isUploading && (
              <div className="text-sm text-neon-blue animate-pulse">
                تصاویر در حال آپلود هستند...
              </div>
            )}

            <ImagePreviewGrid
              urls={gallery}
              onRemove={handleRemoveGalleryImage}
              title="تصاویر انتخاب‌شده"
            />
          </div>

          <div className="flex flex-col xs:flex-row gap-3 xs:gap-6 md:gap-8 justify-between items-center">
            <div className="flex items-center gap-2 xs:gap-1 text-cyan-100 text-sm">
              <Field
                type="checkbox"
                name="isPublished"
                checked={values.isPublished}
                onChange={() =>
                  setFieldValue("isPublished", !values.isPublished)
                }
                className="accent-neon-blue"
              />
              <span>منتشر شود</span>
            </div>

            <div className="flex items-center gap-2 xs:gap-1 text-cyan-100 text-sm">
              <Field
                type="checkbox"
                name="featured"
                checked={values.featured}
                onChange={() => setFieldValue("featured", !values.featured)}
                className="accent-neon-blue"
              />
              <span>ویژه</span>
            </div>

            <button
              type="submit"
              className="bg-neon-blue hover:bg-cyan-800 text-white font-bold px-4 sm:px-5 py-2 rounded-xl shadow transition disabled:opacity-60 min-w-[100px] sm:min-w-[120px] w-full xs:w-auto mt-2 xs:mt-0"
              disabled={isSubmitting || loading || isUploading}
            >
              {isSubmitting || loading
                ? "در حال ثبت..."
                : isUploading
                  ? "در حال آپلود..."
                  : "افزودن پروژه"}
            </button>
          </div>

          {msg.error && (
            <div className="text-rose-400 text-sm font-bold">{msg.error}</div>
          )}

          {msg.succ && (
            <div className="text-emerald-400 text-sm font-bold">{msg.succ}</div>
          )}
        </Form>
      )}
    </Formik>
  );
}

// =====================
// صفحه اصلی
// =====================

export default function ProjectsPage() {
  const {
    data: projectsResponse,
    loading: loadingProjects,
    error: errorProjects,
  } = useFetch<IProjectResponse>("/api/projects");

  const {
    data: projectStatsResponse,
    loading: loadingStats,
    error: errorStats,
  } = useFetch<IProjectStatsResponse>("/api/admin/analytics/projects");

  const [projects, setProjects] = useState<IProject[]>([]);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);

  React.useEffect(() => {
    if (projectsResponse?.data) {
      setProjects(projectsResponse.data);
    }
  }, [projectsResponse]);

  const handleAddProject = (project: IProject) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleDeleteProject = (slug: string) => {
    setProjects((prev) => prev.filter((project) => project.slug !== slug));
  };

  const handleEditProjectClick = (project: IProject) => {
    setEditingProject(project);
  };

  const handleUpdateProject = (updatedProject: IProject) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.slug === updatedProject.slug ? updatedProject : project,
      ),
    );

    setEditingProject(null);
  };

  const handleCloseUpdate = () => {
    setEditingProject(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-6 py-6 sm:py-9">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-neon-blue drop-shadow text-center">
        مدیریت پروژه‌های سایت
      </h1>

      <p className="mb-7 text-cyan-100/80 text-center text-base md:text-lg">
        ثبت و آرشیو پیشرفته پروژه‌ها با تم اختصاصی داشبورد
      </p>

      {loadingStats ? (
        <div className="mb-7 text-cyan-100/80 text-center">
          در حال دریافت آمار...
        </div>
      ) : errorStats ? (
        <div className="mb-7 text-rose-400 text-center">
          خطا در دریافت داده‌های آمار.
        </div>
      ) : (
        <Stats stats={projectStatsResponse?.data} />
      )}

      <section>
        <AddProjectForm onAdd={handleAddProject} />

        {loadingProjects ? (
          <div className="text-cyan-100/70 text-center my-8">
            در حال بارگذاری پروژه‌ها...
          </div>
        ) : errorProjects ? (
          <div className="text-rose-400 font-bold text-center my-8">
            خطا در دریافت پروژه‌ها
          </div>
        ) : (
          <>
            <SimpleTable
              projects={projects}
              onDelete={handleDeleteProject}
              onEdit={handleEditProjectClick}
            />

            {editingProject && (
              <UpdateProjectForm
                project={editingProject}
                onClose={handleCloseUpdate}
                onUpdate={handleUpdateProject}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
