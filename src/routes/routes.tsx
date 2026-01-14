import { createBrowserRouter } from "react-router";
import UserLayout from "../layout/UserLayout";
import App from "../App";
import NotificationFeed from "../pages/NotificationFeed";
import NotificvationSettings from "../pages/NotificvationSettings";
import AdminLayout from "../layout/AdminLayout";
import AdminNotificationsPage from "../pages/AdminNotificationsPage";

export const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/notifications", element: <NotificationFeed /> },
      {
        path: "/settings/notifications",
        element: <NotificvationSettings />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [{ path: "/notifications", element: <AdminNotificationsPage /> }],
  },
]);
