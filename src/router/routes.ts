export const APP_ROUTES_KEY = {
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
