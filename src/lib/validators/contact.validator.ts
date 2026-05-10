import * as yup from "yup";

export const addContactSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "نام حداقل باید شامل 2 کاراکتر باشد.")
    .required("وارد کردن نام الزامی است."),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("ایمیل نامعتبر است.")
    .required("وارد کردن ایمیل الزامی است."),
  subject: yup.string().trim(),
});

export const updateContactSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "نام حداقل باید شامل 2 کاراکتر باشد.")
    .notRequired(),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("ایمیل نامعتبر است.")
    .notRequired(),
  subject: yup.string().trim().notRequired(),
  message: yup
    .string()
    .trim()
    .min(5, "پیام حداقل باید شامل 5 کاراکتر باشد.")
    .notRequired(),
  status: yup
    .string()
    .oneOf(["new", "read", "replied", "archived"], "وضعیت نامعتبر است.")
    .notRequired(),
});
