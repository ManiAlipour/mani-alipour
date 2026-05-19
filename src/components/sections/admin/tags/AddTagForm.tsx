import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface IAddTagFormProps {
  refetch: (overrideUrl?: string | null) => Promise<void>;
}

const TagSchema = Yup.object().shape({
  name: Yup.string().required("نام تگ الزامی است"),
  slug: Yup.string()
    .required("اسلاگ الزامی است")
    .matches(/^[\w-]+$/, "فقط از حروف، اعداد، - و _ استفاده کنید"),
  description: Yup.string(),
});

export default function AddTagForm({ refetch }: IAddTagFormProps) {
  const [status, setStatus] = React.useState<{
    error?: string;
    success?: string;
  }>({});

  return (
    <Formik
      initialValues={{ name: "", slug: "", description: "" }}
      validationSchema={TagSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setStatus({});
        try {
          const res = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            const data = await res.json();
            setStatus({ error: data.message || "خطایی رخ داده است" });
            setSubmitting(false);
            return;
          }

          setStatus({ success: "تگ با موفقیت اضافه شد" });
          resetForm();
          await refetch();
        } catch (e) {
          setStatus({ error: "مشکلی پیش آمد، دوباره تلاش کنید." });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="max-w-md w-full mx-auto bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-6 border border-zinc-800 my-10">
          <h2 className="text-xl font-bold text-neon-blue mb-2 text-center">
            افزودن تگ جدید
          </h2>

          <div className="space-y-4">
            <div>
              <label
                className="block mb-1 font-semibold text-zinc-200"
                htmlFor="name"
              >
                نام تگ <span className="text-red-500">*</span>
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className="w-full rounded-lg px-4 py-2 bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-neon-blue/60 outline-none"
                placeholder="مثلا: جاوااسکریپت"
                autoComplete="off"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                className="block mb-1 font-semibold text-zinc-200"
                htmlFor="slug"
              >
                اسلاگ <span className="text-red-500">*</span>
              </label>
              <Field
                id="slug"
                name="slug"
                type="text"
                className="w-full rounded-lg px-4 py-2 bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-neon-blue/60 outline-none ltr:direction-ltr"
                placeholder="مثلا: javascript"
                autoComplete="off"
              />
              <ErrorMessage
                name="slug"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                className="block mb-1 font-semibold text-zinc-200"
                htmlFor="description"
              >
                توضیحات
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                className="w-full rounded-lg px-4 py-2 bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-neon-blue/60 outline-none min-h-[70px]"
                placeholder="اختیاری"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
          </div>

          {status.error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-2 text-sm text-center">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="bg-neon-green/20 border border-neon-green text-neon-green rounded-lg px-4 py-2 text-sm text-center">
              {status.success}
            </div>
          )}

          <button
            className="w-full py-2 rounded-lg bg-gradient-to-br from-neon-green to-neon-blue text-black font-semibold transition disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "در حال ارسال..." : "افزودن تگ"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
