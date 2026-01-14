import { Bell, Check, Trash2 } from "lucide-react";
import moment from "moment";
import { use } from "react";
import { getNotificationData } from "../api/notifications";

const NotificationFeed = () => {
  const notificationList = use(getNotificationData());
  console.log(notificationList, "noti");

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {notificationList?.data?.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notificationList?.data?.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-2 h-2 rounded-full mt-2 `} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(
                                  notification.category
                                )}`}
                              >
                                {notification.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {moment(notification.timestamp).fromNow()}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                          </div>

                          <div className="flex gap-2">
                            {!notification.read && (
                              <button
                                // onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-green-100 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                            )}
                            <button
                              //   onClick={() =>
                              //     deleteNotification(notification.id)
                              //   }
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Notifications Drawer */}
      {/* {showNotifications && !isAdmin && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default NotificationFeed;
