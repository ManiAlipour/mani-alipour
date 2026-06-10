"use client";
import { useState } from "react"; // اضافه شد
import { useFormik } from "formik";
import { useFetch } from "iso-hooks";
import * as yup from "yup";
import Editor from "@/components/features/EditorBlock";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
  FaSave,
  FaSpinner, // برای لودینگ
} from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import { PiTagFill } from "react-icons/pi";
import { FiEdit2, FiLink, FiFileText, FiUploadCloud } from "react-icons/fi"; // اضافه شد
import { HiDocumentText } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import FancyInputBox from "./Input";

const validationSchema = yup.object({
  title: yup.string().required("عنوان الزامی است"),
  slug: yup
    .string()
    .required("اسلاگ الزامی است")
    .matches(
      /^[a-z0-9-]+$/,
      "اسلاگ باید فقط شامل حروف کوچک لاتین، عدد و خط تیره باشد",
    ),
  excerpt: yup
    .string()
    .min(10, "خلاصه باید حداقل ۱۰ کاراکتر باشد")
    .required("خلاصه الزامی است"),
  cover: yup.string().required("تصویر کاور الزامی است"), // همچنان رشته می‌ماند چون URL ذخیره می‌شود
  readAt: yup
    .number()
    .min(1, "زمان مطالعه حداقل ۱ باشد")
    .required("زمان مطالعه الزامی است"),
  isPublished: yup.boolean(),
  content: yup
    .string()
    .min(20, "متن مقاله حداقل ۲۰ کاراکتر باشد")
    .required("متن مقاله الزامی است"),
  tags: yup.array().of(yup.string()).min(1, "حداقل یک برچسب انتخاب کنید"),
});

interface EditBlogFormProps {
  blog: any; // یا TBlog
  onClose: () => void;
  refetch: () => Promise<void>;
}

export default function EditBlogForm({
  blog,
  onClose,
  refetch,
}: EditBlogFormProps) {
  const [isUploading, setIsUploading] = useState(false); // وضعیت آپلود
  const tagsResponse = useFetch<{ data: any[] }>("/api/tags");

  const formik = useFormik({
    initialValues: {
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      cover: blog.cover || "",
      readAt: blog.readAt || 1,
      isPublished: blog.isPublished ?? true,
      content: blog.content || "",
      tags: (blog.tags || []).map((t: any) =>
        typeof t === "string" ? t : t._id,
      ),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const loadingToast = toast.loading("در حال ثبت تغییرات...");
      try {
        const res = await fetch(`/api/blogs/${blog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "خطا در ویرایش");
        }

        toast.success("مقاله با موفقیت بروزرسانی شد", { id: loadingToast });
        await refetch();
        onClose();
      } catch (error: any) {
        toast.error(error.message || "مشکلی پیش آمد", { id: loadingToast });
      }
    },
  });

  // تابع آپلود فایل
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const uploadToast = toast.loading("در حال آپلود تصویر...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("آپلود ناموفق بود");

      const data = await res.json();
      formik.setFieldValue("cover", data.url);
      toast.success("تصویر با موفقیت آپلود شد", { id: uploadToast });
    } catch (error) {
      toast.error("خطا در آپلود تصویر", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const allTags = tagsResponse.data?.data ?? [];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white/95 dark:bg-[#12142b]/95 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-neon-blue/20 backdrop-blur-xl flex flex-col gap-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
        }}
      >
        {/* Header - همان قبلی */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neon-blue/20 rounded-2xl text-neon-blue">
              <MdEditNote size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ویرایش مقاله</h2>
              <p className="text-xs text-neon-green/70">
                در حال ویرایش: {blog.slug}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <FaTimesCircle size={22} />
          </button>
        </div>

        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FancyInputBox
            icon={<FiEdit2 />}
            label="عنوان جدید"
            error={formik.touched.title && formik.errors.title}
            {...formik.getFieldProps("title")}
          />
          <FancyInputBox
            icon={<FiLink />}
            label="اسلاگ (URL)"
            error={formik.touched.slug && formik.errors.slug}
            {...formik.getFieldProps("slug")}
          />
        </div>

        {/* Read Time & Photo Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FancyInputBox
            icon={<FaRegClock />}
            label="زمان مطالعه"
            type="number"
            error={formik.touched.readAt && formik.errors.readAt}
            {...formik.getFieldProps("readAt")}
          />

          {/* بخش آپلود عکس اختصاصی */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-bold text-neon-blue flex items-center gap-2">
              <BsImage /> تصویر کاور
            </label>
            <div className="relative group overflow-hidden bg-black/20 border-2 border-dashed border-white/10 hover:border-neon-blue/50 rounded-2xl transition-all h-[58px] flex items-center px-4">
              {isUploading ? (
                <div className="flex items-center gap-3 text-neon-blue animate-pulse">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">در حال آپلود...</span>
                </div>
              ) : (
                <label className="flex items-center gap-3 w-full cursor-pointer">
                  <FiUploadCloud className="text-neon-green text-xl" />
                  <span className="text-sm text-gray-400 truncate">
                    {formik.values.cover
                      ? "تغییر تصویر کاور"
                      : "انتخاب فایل تصویر..."}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              )}
              {formik.values.cover && !isUploading && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                  <img
                    src={formik.values.cover}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {formik.touched.cover && formik.errors.cover && (
              <span className="text-[10px] text-red-400 mr-2">
                {formik.errors.cover as string}
              </span>
            )}
          </div>
        </div>

        {/* Excerpt, Tags, Editor - مشابه قبل */}
        <FancyInputBox
          icon={<FiFileText />}
          label="خلاصه مقاله"
          as="textarea"
          rows={2}
          error={formik.touched.excerpt && formik.errors.excerpt}
          {...formik.getFieldProps("excerpt")}
        />

        {/* Tags Section */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-neon-blue flex items-center gap-2">
            <PiTagFill className="text-neon-green" /> انتخاب برچسب‌ها
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-2xl border border-white/5">
            {allTags.map((tag) => {
              const isSelected = formik.values.tags.includes(tag._id);
              return (
                <label
                  key={tag._id}
                  className={twMerge(
                    "cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                    isSelected
                      ? "bg-neon-blue/20 border-neon-blue text-neon-blue"
                      : "bg-slate-800 border-transparent text-gray-500 hover:border-slate-600",
                  )}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => {
                      const nextTags = isSelected
                        ? formik.values.tags.filter(
                            (id: string) => id !== tag._id,
                          )
                        : [...formik.values.tags, tag._id];
                      formik.setFieldValue("tags", nextTags);
                    }}
                  />
                  {tag.name}
                </label>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neon-blue flex items-center gap-2">
            <HiDocumentText /> محتوای متنی
          </label>
          <Editor
            value={formik.values.content}
            onChange={(val) => {
              formik.setFieldValue("content", val);
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                id="isPublishedEdit"
                checked={formik.values.isPublished}
                onChange={formik.handleChange}
                name="isPublished"
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-700 peer-checked:bg-gradient-to-r peer-checked:from-neon-green peer-checked:to-neon-blue rounded-full transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
            </div>
            <label
              htmlFor="isPublishedEdit"
              className="text-sm font-bold text-gray-300 cursor-pointer"
            >
              انتشار عمومی
            </label>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-slate-800 text-gray-400 font-bold hover:bg-slate-700 transition-all"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || isUploading}
              className="px-10 py-3 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-black font-extrabold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {formik.isSubmitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSave />
              )}
              ذخیره نهایی
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
