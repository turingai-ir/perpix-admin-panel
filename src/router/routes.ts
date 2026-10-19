export const APP_ROUTES_KEY = {
  smsTest: { path: "/sms-test", meta: { title: "تست پیامک | پرپیکس" } },
  overview: {
    path: "/overview",
    meta: { title: "نمای کلی | پرپیکس" },
  },
  users: {
    list: {
      path: "/users",
      meta: { title: "مدیریت کاربران | پرپیکس" },
    },
    detail: {
      path: "/users/:userUuid",
      meta: { title: "جزئیات کاربر | پرپیکس" },
    },
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
