import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../api/axios";
import config from "../config";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  readBy: string[];
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user && token) {
      const newSocket = io(config.socket_url);

      newSocket.emit("join", user._id);

      newSocket.on("newNotification", (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      const fetchNotifications = async () => {
        try {
          const res = await api.get("/notifications/my");
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
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, readBy: [...n.readBy, user!._id] } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const updateSubscriptions = async (categories: string[]) => {
    try {
      await api.post("/subscriptions/subscribe", { categories });
      const res = await api.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to update subscriptions", err);
    }
  };

  const unreadCount = notifications.filter(
    (n) => user && !n.readBy.includes(user._id)
  ).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, updateSubscriptions }}
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
