export const APP_ROUTES_KEY = {
  smsTest: { path: "/sms-test", meta: { title: "تست پیامک | پرپیکس" } },
  overview: {
    path: "/overview",
    meta: { title: "نمای کلی | پرپیکس" },
  },
  root: {
    path: "/",
    meta: {
      title: "داشبورد مدیریت",
    },
  },
  app: {
    path: "/",
    meta: {
      title: "داشبورد مدیریت",
    },
  },
  auth: {
    login: {
      path: "/login",
      meta: {
        title: "ورود به پنل مدیریت",
      },
    },
  },
} as const;
