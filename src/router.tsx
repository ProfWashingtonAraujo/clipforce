import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { AppShell } from "./layouts/AppShell";
import { MarketingLayout } from "./layouts/MarketingLayout";
import { LandingPage } from "./features/landing/LandingPage";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { EditorPage } from "./features/editor/EditorPage";
import { TeamPage } from "./features/team/TeamPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/team", element: <TeamPage /> },
        ],
      },
      { path: "/editor/:projectId", element: <EditorPage /> },
    ],
  },
]);
