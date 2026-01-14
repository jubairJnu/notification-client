import { Bell, Check } from "lucide-react";
import moment from "moment";

import type { IReceiptRes } from "../types";
import { useNotifications } from "../context/NotificationContext";

const NotificationFeed = ({
  notificationList,
}: {
  notificationList: IReceiptRes[];
}) => {
  const { markAsRead } = useNotifications();

  return (
    <div className="h-full max-h-screen overflow-y-auto">
      <div className="">
        <div className="divide-y divide-gray-200 space-y-2">
          {notificationList?.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notificationList?.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-blue-50  shadow-lg transition-colors ${
                  !notification.isRead ? "bg-gray-50" : "bg-gray-200"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 `} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full text-slate-50 bg-emerald-500 `}
                          >
                            {notification?.notificationId?.category ||
                              notification?.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {moment(notification.deliveredAt).fromNow()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {notification?.notificationId?.title ||
                            notification?.title}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1 px-2 flex items-center justify-center gap-0.5 bg-green-200 hover:bg-green-100 rounded-lg drop-shadow-2xl transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {notification?.notificationId?.message ||
                        notification?.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;
