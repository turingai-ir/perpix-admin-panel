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
  finance: {
    payments: {
      list: {
        path: "/finance/payments",
        meta: { title: "پرداخت‌ها | پرپیکس" },
      },
      detail: {
        path: "/finance/payments/:paymentUuid",
        meta: { title: "جزئیات پرداخت | پرپیکس" },
      },
    },
    wallets: {
      list: {
        path: "/finance/wallets",
        meta: { title: "کیف پول‌ها | پرپیکس" },
      },
      detail: {
        path: "/finance/wallets/:walletUuid",
        meta: { title: "جزئیات کیف پول | پرپیکس" },
      },
    },
    transactions: {
      path: "/finance/transactions",
      meta: { title: "تراکنش‌های کیف پول | پرپیکس" },
    },
    exchangeRate: {
      path: "/finance/exchange-rate",
      meta: { title: "نرخ ارز و گزارش‌ها | پرپیکس" },
    },
  },
  subscriptions: {
    list: {
      path: "/subscriptions",
      meta: { title: "مدیریت اشتراک‌ها | پرپیکس" },
    },
    detail: {
      path: "/subscriptions/:subscriptionUuid",
      meta: { title: "جزئیات اشتراک | پرپیکس" },
    },
    plans: {
      path: "/subscription-plans",
      meta: { title: "پلن‌های اشتراکی | پرپیکس" },
    },
    operations: {
      path: "/subscription-operations",
      meta: { title: "سوابق عملیات اشتراک | پرپیکس" },
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
