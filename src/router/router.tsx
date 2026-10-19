import { AdminLayout } from "@/features/admin";
import { SmsTestPage } from "@/features/sms-test";
import { createBrowserRouter, Navigate } from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import { ErrorFallbackPage, LoadingSection } from "@/components/custom";
import RootLayout from "@/pages/(root)/layout";
import { OverviewPage } from "@/features/overview";
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
