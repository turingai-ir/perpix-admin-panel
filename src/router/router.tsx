import { AdminLayout } from "@/features/admin";
import { SmsTestPage } from "@/features/sms-test";
import { createBrowserRouter, Navigate } from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import { ErrorFallbackPage, LoadingSection } from "@/components/custom";
import RootLayout from "@/pages/(root)/layout";
import { OverviewPage } from "@/features/overview";
import { UsersListPage, UserDetailPage } from "@/features/users";
import {
  PaymentsListPage,
  PaymentDetailPage,
  WalletsListPage,
  WalletDetailPage,
  TransactionsListPage,
  ExchangeRatePage,
} from "@/features/finance";
import { LoginPage, SessionGate } from "@/features/auth";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorFallbackPage />,
    hydrateFallbackElement: <LoadingSection />,
    children: [
      {
        element: (
          <SessionGate>
            <AdminLayout />
          </SessionGate>
        ),
        children: [
          {
            path: APP_ROUTES_KEY.overview.path,
            element: <OverviewPage />,
            handle: { title: APP_ROUTES_KEY.overview.meta.title },
          },
          {
            path: APP_ROUTES_KEY.users.list.path,
            element: <UsersListPage />,
            handle: { title: APP_ROUTES_KEY.users.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.users.detail.path,
            element: <UserDetailPage />,
            handle: { title: APP_ROUTES_KEY.users.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.payments.list.path,
            element: <PaymentsListPage />,
            handle: { title: APP_ROUTES_KEY.finance.payments.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.payments.detail.path,
            element: <PaymentDetailPage />,
            handle: {
              title: APP_ROUTES_KEY.finance.payments.detail.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.finance.wallets.list.path,
            element: <WalletsListPage />,
            handle: { title: APP_ROUTES_KEY.finance.wallets.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.wallets.detail.path,
            element: <WalletDetailPage />,
            handle: { title: APP_ROUTES_KEY.finance.wallets.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.transactions.path,
            element: <TransactionsListPage />,
            handle: { title: APP_ROUTES_KEY.finance.transactions.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.exchangeRate.path,
            element: <ExchangeRatePage />,
            handle: { title: APP_ROUTES_KEY.finance.exchangeRate.meta.title },
          },
          {
            path: APP_ROUTES_KEY.smsTest.path,
            element: <SmsTestPage />,
            handle: { title: APP_ROUTES_KEY.smsTest.meta.title },
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to={APP_ROUTES_KEY.overview.path} replace />,
      },
      {
        path: APP_ROUTES_KEY.auth.login.path,
        element: <LoginPage />,
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
    ],
  },
]);
