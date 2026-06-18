"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useFetch } from "iso-hooks";
import * as yup from "yup";
import Editor from "@/components/features/EditorBlock";
import { FaRegClock, FaRocket, FaSpinner } from "react-icons/fa";
import { MdPublishedWithChanges } from "react-icons/md";
import { PiTagFill } from "react-icons/pi";
import { FiEdit2, FiLink, FiFileText } from "react-icons/fi";
import { HiDocumentText } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import FancyInputBox from "./Input";
import { UploadButton } from "@/utils/uploadthing";

const validationSchema = yup.object({
  title: yup.string().required("عنوان مقاله رو وارد نکردی"),
  slug: yup
    .string()
    .required("اسلاگ الزامیه")
    .matches(/^[a-z0-9-]+$/, "فقط حروف کوچک لاتین و خط تیره"),
  excerpt: yup
    .string()
    .min(10, "خلاصه خیلی کوتاهه")
    .required("خلاصه الزامی است"),
  cover: yup.string().required("کاور مقاله کو؟"),
  readTime: yup.number().min(1, "حداقل ۱ دقیقه").required("زمان مطالعه؟"),
  content: yup
    .string()
    .min(20, "محتوا خالیه!")
    .required("متن مقاله الزامی است"),
  tags: yup.array().min(1, "حداقل یک برچسب"),
});

export default function AddBlogForm({ refetch }: { refetch: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const tagsResponse = useFetch<{ data: TTag[] }>("/api/tags");

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      excerpt: "",
      cover: "",
      readTime: "",
      isPublished: true,
      content: "",
      tags: [] as string[],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const loadToast = toast.loading("در حال ثبت...");
      try {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          console.log(res);
          throw new Error();
        }

        toast.success("ثبت شد!", { id: loadToast });
        resetForm();
        await refetch();
      } catch (err) {
        console.error(err);

        toast.error("خطایی رخ داد", { id: loadToast });
      }
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("در حال آپلود تصویر...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      formik.setFieldValue("cover", data.url);

      toast.success("آپلود شد ✅", { id: toastId });
    } catch {
      toast.error("آپلود ناموفق بود", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  if (tagsResponse.loading)
    return <div className="p-20 text-center text-neon-blue">...</div>;

  const tags = tagsResponse.data?.data ?? [];

  return (
    <div className="w-full max-w-4xl mx-auto md:p-4">
      <form
        onSubmit={formik.handleSubmit}
        className={twMerge(
          "relative overflow-hidden",
          "bg-[#0f172a] md:rounded-[2.5rem] border-y md:border border-white/10 shadow-2xl",
          "flex flex-col gap-6 md:gap-8",
          "px-5 py-8 md:p-12",
        )}
      >
        <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[100px] -z-10"></div>
        <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-neon-green/10 blur-[100px] -z-10"></div>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
          <div className="p-3 bg-neon-blue/10 rounded-2xl">
            <MdPublishedWithChanges className="text-3xl text-neon-blue" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white md:text-3xl">
              ثبت مقاله جدید
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              اطلاعات رو با دقت وارد کنید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          <div className="md:col-span-2">
            <FancyInputBox
              icon={<FiEdit2 />}
              label="عنوان مقاله"
              placeholder="مثلاً: آموزش Next.js"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && formik.errors.title}
            />
          </div>

          <FancyInputBox
            icon={<FiLink />}
            label="لینک (Slug)"
            placeholder="nextjs-tutorial"
            {...formik.getFieldProps("slug")}
            error={formik.touched.slug && formik.errors.slug}
          />

          <FancyInputBox
            icon={<FaRegClock />}
            label="زمان مطالعه"
            type="number"
            {...formik.getFieldProps("readTime")}
            error={formik.touched.readTime && formik.errors.readTime}
          />

          <div className="md:col-span-2">
            <FancyInputBox
              icon={<FiFileText />}
              label="خلاصه کوتاه"
              as="textarea"
              rows={2}
              {...formik.getFieldProps("excerpt")}
              error={formik.touched.excerpt && formik.errors.excerpt}
            />
          </div>

          {/* Cover Upload */}
          <div className="space-y-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
              <BsImage className="text-neon-blue" /> آپلود کاور
            </label>

            <UploadButton
              endpoint="imageUploader"
              onUploadBegin={() => {
                setIsUploading(true);
                toast.loading("در حال آپلود...", { id: "upload" });
              }}
              onClientUploadComplete={(res: any) => {
                const url = res?.[0]?.url;

                if (url) {
                  formik.setFieldValue("cover", url);
                  toast.success("آپلود با موفقیت انجام شد ✅", {
                    id: "upload",
                  });
                }

                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                toast.error(`خطا در آپلود: ${error.message}`, { id: "upload" });
                setIsUploading(false);
              }}
            />

            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-neon-blue">
                <FaSpinner className="animate-spin" />
                درحال آپلود...
              </div>
            )}

            {formik.values.cover && (
              <div className="relative overflow-hidden border aspect-video rounded-2xl border-white/10">
                <img
                  src={formik.values.cover}
                  className="object-cover w-full h-full"
                  alt="Preview"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
              <PiTagFill className="text-neon-green" /> انتخاب برچسب‌ها
            </label>

            <div className="flex flex-wrap gap-2 p-1 overflow-y-auto max-h-40">
              {tags.map((tag) => {
                const isSelected = formik.values.tags.includes(tag._id);

                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? formik.values.tags.filter((t) => t !== tag._id)
                        : [...formik.values.tags, tag._id];

                      formik.setFieldValue("tags", next);
                    }}
                    className={twMerge(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      isSelected
                        ? "bg-neon-blue text-black border-neon-blue"
                        : "bg-white/5 border-white/10 text-gray-400",
                    )}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-3 md:col-span-2">
            <div className="px-1">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <HiDocumentText /> محتوای مقاله
              </label>
            </div>

            <Editor
              value={formik.values.content}
              onChange={(val) => {
                formik.setFieldValue("content", val);
                formik.setFieldTouched("content", true, false);
              }}
            />

            {formik.touched.content && formik.errors.content && (
              <p className="text-red-400 text-xs mr-2">
                {formik.errors.content}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formik.values.isPublished}
              onChange={() =>
                formik.setFieldValue("isPublished", !formik.values.isPublished)
              }
            />
            انتشار همگانی
          </label>

          <button
            type="submit"
            disabled={formik.isSubmitting || isUploading}
            className="flex items-center justify-center w-full gap-3 px-10 py-4 font-black text-black md:w-auto bg-gradient-to-r from-neon-green to-neon-blue rounded-2xl"
          >
            {formik.isSubmitting ? "صبور باش..." : "پرتاب مقاله"}
            <FaRocket />
          </button>
        </div>
      </form>
    </div>
  );
}
