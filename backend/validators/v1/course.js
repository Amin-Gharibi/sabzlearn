const yup = require("yup");

const createCourseValidator = yup.object().shape({
  name: yup.string().required("نام دوره الزامی است"),
  description: yup.string().required("توضیحات دوره الزامی است"),
  cover: yup.object().shape({
    size: yup
      .number()
      .max(30 * 1024 * 1024, "حجم تصویر نباید بیشتر از 30 مگابایت باشد"),
    mimetype: yup
      .string()
      .oneOf(
        ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        "فرمت تصویر باید JPEG یا PNG یا WebP باشد"
      )
      .required("تصویر الزامی می باشد"),
  }),
  support: yup.string().required("نحوه پشتیبانی دوره الزامی است"),
  shortName: yup.string().required("نام کوتاه دوره الزامی است"),
  price: yup.number().required("قیمت دوره الزامی است").min(0),
  status: yup
    .number()
    .required("وضعیت دوره الزامی است")
    .oneOf(
      [1, 2, 3],
      "وضعیت دوره باید یکی از این 3 حالت باشد"
    ),
  discount: yup
    .number()
    .min(0, "تخفیف دوره نمی‌تواند منفی باشد")
    .max(100, "تخفیف دوره نمی‌تواند بیشتر از ۱۰۰ درصد باشد"),
  categoryID: yup
    .string()
    .required("شناسه دسته‌بندی الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی معتبر نیست"),
  promisedSessions: yup
      .number()
      .min(0, "تخفیف دوره نمیتواند منفی باشد"),
  requirement: yup
      .string()
      .required("در صورت نبود پیشنیاز بنویسید ندارد"),
  watchingOptions: yup
      .string()
      .required("نحوه مشاهده دوره را بنویسید"),
  rate: yup
      .number()
      .required("امتیاز نیازه")
      .min(0, "امتیاز نمیتونه از 0 کمتر باشه")
      .max(5, "امتیاز بیشتر از 5 نمیتونه باشه"),
});


const updateCourseValidator = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  cover: yup.object().shape({
    size: yup
      .number()
      .max(30 * 1024 * 1024, "حجم تصویر نباید بیشتر از 30 مگابایت باشد"),
    mimetype: yup
      .string()
      .oneOf(
        ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        "فرمت تصویر باید JPEG یا PNG یا WebP باشد"
      )
      ,
  }),
  support: yup.string(),
  shortName: yup.string(),
  price: yup.number().min(0),
  status: yup
    .string()
    .oneOf(
      ["1", "2", "3"],
      "وضعیت باید 1 یا 2 یا 3 باشد"
    ),
  discount: yup
    .number()
    .min(0, "تخفیف دوره نمی‌تواند منفی باشد")
    .max(100, "تخفیف دوره نمی‌تواند بیشتر از ۱۰۰ درصد باشد"),
  categoryID: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی معتبر نیست"),
  promisedSessions: yup
    .number()
    .min(0, "تخفیف دوره نمیتواند منفی باشد"),
  requirement: yup
    .string()
    .required("در صورت نبود پیشنیاز بنویسید ندارد"),
  watchingOptions: yup
    .string()
    .required("نحوه مشاهده دوره را بنویسید"),
});


const getOneValidator = yup.object().shape({
  params: yup.object().shape({
    shortName: yup.string().required("نام کوتاه دوره الزامی است"),
  }),
});
const createSessionValidator = yup.object().shape({
  title: yup.string().required("عنوان جلسه الزامی است"),
  time: yup.string().required("زمان جلسه الزامی است"),
  free: yup
    .number()
    .min(0, "وضعیت رایگان/غیررایگان باید 0 یا 1 باشد")
    .max(1, "وضعیت رایگان/غیررایگان باید 0 یا 1 باشد")
    .required("وضعیت رایگان/غیررایگان الزامی است"),
  id: yup
    .string()
    .required("شناسه دوره الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه دوره معتبر نیست"),
  video: yup
    .mixed()
    .required("فایل ویدیوی جلسه الزامی است")
    .test(
      "fileSize",
      "حجم فایل ویدیوی جلسه نباید بیشتر از 50 مگابایت باشد",
      (value) => {
        if (!value) return true;
        return value.size <= 50 * 1024 * 1024;
      }
    )
    .test("mimetype", "فرمت فایل ویدیوی جلسه معتبر نیست", (value) => {
      if (!value) return true;
      return ["video/mp4", "video/webm", "video/mpeg"].includes(value.mimetype);
    }),
    thumbnail: yup.object().shape({
      size: yup
        .number()
        .max(30 * 1024 * 1024, "حجم تصویر نباید بیشتر از 30 مگابایت باشد"),
      mimetype: yup
        .string()
        .oneOf(
          ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          "فرمت تصویر باید JPEG یا PNG یا WebP باشد"
        )
    }),
});

const registerValidator = yup.object().shape({
  price: yup
    .number()
    .typeError("قیمت باید عددی باشد")
    .required("قیمت الزامی است")
    .min(0, "قیمت نمی‌تواند کمتر از صفر باشد"),
});

const getCategoryCoursesValidator = yup.object().shape({
  categoryName: yup.string().required("نام دسته‌بندی الزامی است"),
});

const removeCourseValidator = yup.object().shape({
  params: yup.object().shape({
    id: yup
      .string()
      .required("شناسه دوره الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه دوره معتبر نیست"),
  }),
});
const removeSessionValidator = yup.object().shape({
  params: yup.object().shape({
    id: yup
      .string()
      .required("شناسه جلسه الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه جلسه معتبر نیست"),
  }),
});

const getSessionInfoValidator = yup.object().shape({
  shortName: yup.string().required("نام کوتاه دوره الزامی است"),
  sessionID: yup
    .string()
    .required("شناسه جلسه الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه جلسه معتبر نیست"),
});

const getRelatedValidator = yup.object().shape({
  shortName: yup.string().required("نام کوتاه دوره الزامی است"),
});

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  getOneValidator,
  createSessionValidator,
  registerValidator,
  getCategoryCoursesValidator,
  removeCourseValidator,
  removeSessionValidator,
  getSessionInfoValidator,
  getRelatedValidator,
};
