"use client";
import { useFormik } from "formik";
import { useFetch } from "iso-hooks";
import * as yup from "yup";
import Editor from "@/components/features/EditorBlock";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
  FaRocket,
} from "react-icons/fa";
import { MdPublishedWithChanges } from "react-icons/md";
import { PiTagFill } from "react-icons/pi";
import { FiEdit2, FiLink, FiFileText } from "react-icons/fi";
import { HiDocumentText } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import FancyInputBox from "./Input";

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
  cover: yup.string().url("آدرس عکس معتبر نیست").required("کاور مقاله کو؟"),
  readTime: yup.number().min(1, "حداقل ۱ دقیقه").required("زمان مطالعه؟"),
  content: yup
    .string()
    .min(20, "محتوا خالیه!")
    .required("متن مقاله الزامی است"),
  tags: yup.array().min(1, "حداقل یک برچسب"),
});

export default function AddBlogForm({ refetch }: { refetch: any }) {
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
        if (!res.ok) throw new Error();
        toast.success("ثبت شد!", { id: loadToast });
        resetForm();
        await refetch();
      } catch (error) {
        toast.error("خطایی رخ داد", { id: loadToast });
      }
    },
  });

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

        {/* Form Body */}
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

          {/* Cover Section */}
          <div className="space-y-4 md:col-span-2">
            <FancyInputBox
              icon={<BsImage />}
              label="آدرس کاور"
              {...formik.getFieldProps("cover")}
              error={formik.touched.cover && formik.errors.cover}
            />
            {formik.values.cover && (
              <div className="relative overflow-hidden border aspect-video rounded-2xl border-white/10 group">
                <img
                  src={formik.values.cover}
                  className="object-cover w-full h-full"
                  alt="Preview"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
                  <span className="text-xs font-bold text-white">
                    پیش‌نمایش کاور
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
              <PiTagFill className="text-neon-green" /> انتخاب برچسب‌ها
            </label>
            <div className="flex flex-wrap gap-2 p-1 overflow-y-auto max-h-40 custom-scrollbar">
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
                        ? "bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30",
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
            <label className="flex items-center gap-2 px-1 text-sm font-bold text-gray-400">
              <HiDocumentText /> محتوای مقاله
            </label>
            <div className="rounded-2xl border border-white/10 bg-black/20 min-h-[300px]">
              <Editor
                value={formik.values.content}
                onChange={(val) => formik.setFieldValue("content", val)}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 md:static bg-[#0f172a] md:bg-transparent pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-2 md:pb-0">
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div
              onClick={() =>
                formik.setFieldValue("isPublished", !formik.values.isPublished)
              }
              className={twMerge(
                "w-14 h-7 rounded-full p-1 transition-all duration-300 relative border",
                formik.values.isPublished
                  ? "bg-neon-green/20 border-neon-green/30 shadow-[0_0_10px_rgba(74,222,128,0.1)]"
                  : "bg-zinc-800 border-white/5",
              )}
            >
              <div
                className={twMerge(
                  "w-5 h-5 rounded-full transition-all duration-300 shadow-sm",
                  formik.values.isPublished
                    ? "-translate-x-7 bg-neon-green shadow-[0_0_8px_#4ade80]" // مقدار منفی برای حرکت به چپ در حالت RTL
                    : "translate-x-0 bg-zinc-500",
                )}
              />
            </div>
            <span
              className={twMerge(
                "text-sm font-bold transition-colors",
                formik.values.isPublished
                  ? "text-neon-green"
                  : "text-gray-500 group-hover:text-gray-400",
              )}
            >
              انتشار همگانی
            </span>
          </label>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center justify-center w-full gap-3 px-10 py-4 font-black text-black transition-transform shadow-lg md:w-auto bg-gradient-to-r from-neon-green to-neon-blue rounded-2xl shadow-neon-blue/20 active:scale-95"
          >
            {formik.isSubmitting ? "صبور باش..." : "پرتاب مقاله"}
            <FaRocket />
          </button>
        </div>
      </form>
    </div>
  );
}
