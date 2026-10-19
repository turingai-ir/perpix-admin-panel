import { createBrowserRouter } from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import { ErrorFallbackPage, LoadingSection } from "@/components/custom";
import RootLayout from "@/pages/(root)/layout";
import DashboardPage from "@/pages/(root)/page";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorFallbackPage />,
    hydrateFallbackElement: <LoadingSection />,
    children: [
      {
        path: APP_ROUTES_KEY.root.path,
        element: <DashboardPage />,
        handle: {
          title: APP_ROUTES_KEY.root.meta.title,
        },
      },
    ],
  },
]);
