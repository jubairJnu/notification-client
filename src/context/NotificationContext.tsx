import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../api/axios";
import config from "../config";

interface Notification {
  _id: string;
  notificationId: {
    title: string;
    message: string;
    category: string;
    createdBy: {
      name: string;
    };
    status: "draft" | "send";
  };
  deliveredAt: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: any;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  updateSubscriptions: (categories: string[]) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    if (user && token) {
      const newSocket = io(config.socket_url, {
        auth: {
          token: token,
        },
      });

      newSocket.on("notification:new", (notification: Notification) => {
        setNotifications((prev: any) => {
          if (Array.isArray(prev)) {
            return [notification, ...prev];
          }
          if (prev && typeof prev === "object" && prev.data) {
            return { ...prev, data: [notification, ...prev.data] };
          }
          return [notification];
        });
      });

      const fetchNotifications = async () => {
        try {
          const res = await api.get("/recipients/my");
          setNotifications(res.data);
        } catch (err) {
          console.error("Failed to fetch notifications", err);
        }
      };
      fetchNotifications();

      return () => {
        newSocket.disconnect();
      };
    } else {
      setNotifications([]);
    }
  }, [user, token]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/recipients/${id}`);
      setNotifications((prev: any) => {
        const updateItem = (n: any) =>
          n._id === id ? { ...n, isRead: true } : n;
        if (Array.isArray(prev)) {
          return prev.map(updateItem);
        }
        if (prev && typeof prev === "object" && prev.data) {
          return { ...prev, data: prev.data.map(updateItem) };
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const updateSubscriptions = async (categories: string[]) => {
    try {
      await api.post("/subscribe", { categories });
      const res = await api.get("/recipients/my");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to update subscriptions", err);
    }
  };

  const notificationList = Array.isArray(notifications)
    ? notifications
    : notifications?.data || [];
  const unreadCount = notificationList.filter((n: any) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificationList,
        unreadCount,
        markAsRead,
        updateSubscriptions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return context;
};
