import { createBrowserRouter } from "react-router";
import UserLayout from "../layout/UserLayout";
import App from "../App";

export const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      { path: "/", element: <App /> },
      //   { path: "/notifications", element: <NotificationsFeedPage /> },
      //   {
      //     path: "/settings/notifications",
      //     element: <NotificationSettingsPage />,
      //   },
    ],
  },
  {
    path: "/admin",
    // element: <AdminLayout />, // add protection here if needed
    // children: [{ path: "notifications", element: <AdminNotificationsPage /> }],
    // errorElement: <NotFound />,
  },
]);
