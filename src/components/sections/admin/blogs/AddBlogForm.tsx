"use client";
import { useFormik } from "formik";
import { useFetch } from "iso-hooks";
import * as yup from "yup";
import Editor from "@/components/features/EditorBlock";
import { FaCheckCircle, FaTimesCircle, FaRegClock } from "react-icons/fa";
import { MdPublishedWithChanges } from "react-icons/md";
import { PiTagFill } from "react-icons/pi";
import { FiEdit2, FiLink, FiFileText } from "react-icons/fi";
import { HiDocumentText } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

interface TagsResponse {
  message: string;
  data: TTag[];
}

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
  cover: yup
    .string()
    .url("آدرس تصویر معتبر نیست")
    .required("آدرس تصویر الزامی است"),
  readTime: yup
    .number()
    .min(1, "زمان مطالعه باید حداقل ۱ باشد")
    .typeError("زمان مطالعه باید یک عدد باشد")
    .required("زمان مطالعه الزامی است"),
  isPublished: yup.boolean(),
  content: yup
    .string()
    .min(20, "متن مقاله باید حداقل ۲۰ کاراکتر باشد")
    .required("متن مقاله الزامی است"),
  tags: yup.array().of(yup.string()).min(1, "حداقل یک برچسب انتخاب کنید"),
});

export default function AddBlogForm() {
  const tagsResponse = useFetch<TagsResponse>("/api/tags");

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
      try {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          alert(errorData?.message || "خطا در ثبت مقاله! لطفا دوباره تلاش کنید.");
          return;
        }

        alert("ثبت با موفقیت انجام شد!");
        resetForm();
      } catch (error) {
        alert("خطا در برقراری ارتباط با سرور");
      }
    },
  });

  if (tagsResponse.loading)
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin bg-gradient-to-r from-neon-blue to-neon-green rounded-full h-10 w-10 border-4 border-t-transparent border-neon-blue"></span>
        <span className="mr-3 text-lg text-neon-blue font-shabnam tracking-wide">
          در حال بارگذاری ...
        </span>
      </div>
    );

  const tags = tagsResponse.data?.data ?? [];

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mx-auto max-w-2xl w-full bg-white/95 dark:bg-[#171834]/95 px-4 sm:px-6 md:p-14 p-6 rounded-[2.5rem] shadow-[0_6px_46px_0_rgba(36,210,220,0.14)] border border-neon-blue/15 dark:border-neon-green/10 flex flex-col gap-8 sm:gap-10 my-10 sm:my-16 md:my-20 backdrop-blur-[7px] relative"
      style={{
        fontFamily: "Shabnam, Vazir, IRANSans, Yekan, sans-serif",
        background:
          "linear-gradient(135deg,rgba(137,223,255,.06) 0,rgba(119,237,192,.09) 100%)",
      }}
    >
      <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-gradient-to-l from-white to-neon-blue/10 dark:from-[#10111b] dark:to-[#1d3443] border border-neon-blue/30 dark:border-neon-green/20 rounded-2xl sm:rounded-3xl shadow-lg px-4 py-2 sm:px-10 sm:py-3 flex items-center gap-2 sm:gap-3 max-w-[90vw] sm:max-w-none">
        <MdPublishedWithChanges className="text-2xl sm:text-3xl text-neon-blue animate-pulse" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-gray-700 dark:text-neon-green font-shabnam mt-0 whitespace-nowrap">
          ثبت مقاله جدید
        </h2>
      </div>

      {/* Title */}
      <FancyInputBox
        icon={<FiEdit2 />}
        placeholder="مثلاً: آشنایی با هوش مصنوعی"
        label="عنوان مقاله"
        id="title"
        type="text"
        error={formik.touched.title && formik.errors.title}
        {...formik.getFieldProps("title")}
      />

      {/* Slug & ReadTime */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <FancyInputBox
          icon={<FiLink />}
          label="اسلاگ (slug)"
          placeholder="ai-introduction"
          id="slug"
          type="text"
          error={formik.touched.slug && formik.errors.slug}
          {...formik.getFieldProps("slug")}
          className="flex-1"
        />
        <FancyInputBox
          icon={<FaRegClock />}
          label="زمان مطالعه (دقیقه)"
          id="readTime"
          placeholder="5"
          type="number"
          min={1}
          error={formik.touched.readTime && formik.errors.readTime}
          {...formik.getFieldProps("readTime")}
          className="w-full sm:w-44"
        />
      </div>

      {/* Excerpt */}
      <FancyInputBox
        icon={<FiFileText />}
        label="خلاصه کوتاه"
        id="excerpt"
        as="textarea"
        placeholder="یک توضیح کوتاه درباره مقاله..."
        rows={3}
        error={formik.touched.excerpt && formik.errors.excerpt}
        {...formik.getFieldProps("excerpt")}
      />

      {/* Cover */}
      <FancyInputBox
        icon={<BsImage />}
        label="آدرس تصویر کاور"
        id="cover"
        type="text"
        placeholder="https://example.com/image.jpg"
        error={formik.touched.cover && formik.errors.cover}
        {...formik.getFieldProps("cover")}
        trailing={
          formik.values.cover ? (
            <div className="flex w-full justify-center">
              <img
                src={formik.values.cover}
                className="mt-3 rounded-xl border border-neon-blue/20 shadow-lg max-h-32 sm:max-h-40 mx-auto transition-all"
                alt="پیش‌نمایش کاور"
                style={{
                  objectFit: "cover",
                  maxWidth: "100%",
                }}
                onError={(e: any) => (e.target.style.display = "none")}
              />
            </div>
          ) : null
        }
      />

      {/* Tags */}
      <div>
        <label className="block text-base font-bold mb-3 sm:mb-4 text-neon-blue flex items-center gap-2">
          <PiTagFill className="text-lg text-neon-green" />
          برچسب‌ها
        </label>
        <div className="flex flex-wrap gap-x-2 gap-y-3">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <label
                key={tag._id}
                className={twMerge(
                  "text-xs sm:text-sm rounded-2xl py-1 px-3 sm:py-1.5 sm:px-5 drop-shadow-md cursor-pointer border-2 font-shabnam bg-gradient-to-tr transition-all duration-200 transform hover:scale-105 hover:border-neon-blue",
                  formik.values.tags.includes(tag._id)
                    ? "from-neon-blue/90 to-neon-blue/80 text-white border-neon-green"
                    : "from-gray-100 dark:from-[#20204a] to-gray-50 dark:to-[#232246] border-gray-100 dark:border-[#2a2a40] text-neon-blue/80",
                )}
                style={{ minWidth: "70px", textAlign: "center" }}
              >
                <input
                  type="checkbox"
                  value={tag._id}
                  checked={formik.values.tags.includes(tag._id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    formik.setFieldValue(
                      "tags",
                      checked
                        ? [...formik.values.tags, value]
                        : formik.values.tags.filter((t) => t !== value),
                    );
                  }}
                  className="hidden"
                />
                <span>
                  {formik.values.tags.includes(tag._id) ? (
                    <FaCheckCircle className="inline text-[14px] sm:text-[16px] mb-0.5 mr-1 text-neon-green" />
                  ) : (
                    ""
                  )}
                  {tag.name}
                </span>
              </label>
            ))
          ) : (
            <span className="text-xs text-gray-400">هیچ برچسبی پیدا نشد</span>
          )}
        </div>
        {formik.touched.tags && formik.errors.tags && (
          <div className="text-xs mt-3 px-1 font-bold text-red-500 flex items-center gap-1">
            <FaTimesCircle />
            {formik.errors.tags as string}
          </div>
        )}
      </div>
      {/* Content */}
      <div>
        <label className="flex items-center gap-2 mb-2 sm:mb-3 text-base font-bold text-neon-blue">
          <HiDocumentText />
          متن مقاله
        </label>
        <div
          className={
            "rounded-2xl ring-1 ring-neon-blue/10 shadow-[0_2px_24px_rgba(37,255,83,0.10)] bg-gradient-to-br from-[#232a33] to-[#173338] dark:from-[#202041]/80 dark:to-[#252352]/90 min-h-[180px] sm:min-h-[220px] p-2 sm:p-4"
          }
        >
          <EditorBlockWrapper
            value={formik.values.content}
            onChange={(val) => formik.setFieldValue("content", val)}
          />
        </div>
        {formik.touched.content && formik.errors.content && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-red-500 font-bold mt-2">
            <FaTimesCircle /> {formik.errors.content}
          </div>
        )}
      </div>
      {/* IsPublished */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 px-1">
        <label className="relative inline-flex cursor-pointer items-center min-w-[48px] sm:min-w-0">
          <input
            type="checkbox"
            id="isPublished"
            checked={formik.values.isPublished}
            onChange={formik.handleChange}
            name="isPublished"
            className="sr-only peer"
          />
          {/* Fix for switch knob all the way right: set correct translate values for both breakpoints */}
          <div className="w-10 h-6 sm:w-12 sm:h-7 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-neon-green peer-checked:to-neon-blue/80 dark:bg-[#36375b] rounded-full transition-all duration-200 shadow-inner"></div>
          <span
            className="absolute left-1 top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white border border-gray-300 rounded-full transition-all duration-200 peer-checked:translate-x-[1.5rem] sm:peer-checked:translate-x-[1.75rem] peer-checked:border-neon-green shadow"
            // Explanation: 1.5rem = 24px (for w-10, 40px-16px margin = 24px movement), 1.75rem = 28px (for sm:w-12/48px-20px = 28px).
          ></span>
        </label>
        <label
          htmlFor="isPublished"
          className="text-gray-700 dark:text-neon-green font-bold font-shabnam text-base sm:text-lg select-none"
        >
          به صورت عمومی منتشر شود
        </label>
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-8 sm:mt-10 w-full py-3 sm:py-4 bg-gradient-to-l from-neon-green/95 to-neon-blue rounded-[1.5rem] sm:rounded-[1.9rem] font-shabnam text-white font-extrabold text-xl sm:text-2xl shadow-[0_8px_24px_rgba(48,235,220,0.20)] hover:from-neon-blue hover:to-neon-green transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-neon-green/40 border-none"
      >
        ثبت مقاله
      </button>
    </form>
  );
}

// FancyInputBox: ظاهر مدرن‌تر اینپوت به همراه آیکون و خطا
function FancyInputBox({
  icon,
  label,
  error,
  trailing,
  as = "input",
  className,
  value,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  error?: string | boolean;
  trailing?: React.ReactNode;
  as?: "input" | "textarea";
  className?: string;
  value?: string;
  [x: string]: any;
}) {
  const Tag = as as any;
  const hasValue =
    typeof value === "string"
      ? value.length > 0
      : value != null && value !== undefined;
  return (
    <div className={twMerge("mb-2", className)}>
      <label className="font-bold mb-2 flex items-center gap-2 text-base text-neon-blue">
        {icon}
        <span>{label}</span>
      </label>
      <div className="relative flex items-center shadow-none group">
        <span
          className={twMerge(
            "absolute right-3 top-1/2 -translate-y-1/2 text-xl text-neon-blue group-focus-within:text-neon-green transition-all pointer-events-none",
            hasValue ? "opacity-0" : "opacity-100",
          )}
        >
          {icon}
        </span>
        <Tag
          {...props}
          value={value}
          className={twMerge(
            "input-fancy peer",
            error
              ? "ring-2 ring-red-300 border-red-300"
              : "focus:ring-2 focus:ring-neon-blue/30",
            as === "textarea" ? "h-14 sm:h-20 pr-11" : "h-10 sm:h-12 pr-11",
          )}
          style={{
            fontWeight: "bold",
            fontFamily: "inherit",
            fontSize: "1rem",
          }}
        />
        {trailing}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-red-500 mt-2 font-bold">
          <FaTimesCircle /> {error}
        </div>
      )}
    </div>
  );
}

// Editor
type EditorBlockWrapperProps = {
  value: string;
  onChange: (value: string) => void;
};
function EditorBlockWrapper({ value, onChange }: EditorBlockWrapperProps) {
  return <Editor value={value} onChange={onChange} />;
}

const fancyInputStyle = `
.input-fancy {
  width: 100%;
  border-radius: 1.3rem;
  padding: 0.4rem 1rem 0.4rem 2.2rem;
  border: 1.5px solid #334856;
  background: linear-gradient(99deg, #222c38 0%, #2d424b 100%);
  color: #edfdf7;
  transition: all 0.17s cubic-bezier(.76,.03,.54,.93);
  font-size: 1rem;
  outline: none;
  box-shadow: 0 0 0 0 #7deeff00;
}
@media (min-width: 640px) {
  .input-fancy {
    font-size: 1.1rem;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
  }
}
.dark .input-fancy {
  border-color: #2adc76;
  color: #affff3;
  background: linear-gradient(123deg,#151928 0%,#183825 95%);
}
.input-fancy:focus {
  border-color: #15e1fd;
  box-shadow: 0 0 0 2px #35ffdf27;
  background: linear-gradient(98deg, #233947 0%, #284448 100%);
}
.dark .input-fancy:focus {
  border-color: #2adc76;
  background: linear-gradient(120deg,#198050d4 10%,#223040 95%);
}
.input-fancy::placeholder {
  color: #71a5abbe;
  font-weight: 400;
  opacity: 1;
}
.dark .input-fancy::placeholder {
  color: #21d394ac;
}
`;

if (
  typeof window !== "undefined" &&
  !document.getElementById("fancy-input-style")
) {
  const style = document.createElement("style");
  style.id = "fancy-input-style";
  style.innerHTML = fancyInputStyle;
  document.head.appendChild(style);
}
