import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import moment from "moment";
import type { IReceiptRes } from "../types";
import { Check } from "lucide-react";
import NotificationFeed from "./NotificationFeed";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, updateSubscriptions } =
    useNotifications();
  console.log(notifications, "nnnnnn");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.subscriptions || []
  );

  const categories = ["System", "Task", "Announcement", "Update"];

  const handleSubscriptionChange = (category: string) => {
    const newSubs = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSubs);
  };

  const handleSaveSubscriptions = async () => {
    try {
      await updateSubscriptions(selectedCategories);
      alert("Subscriptions updated!");
    } catch (err) {
      alert("Failed to update subscriptions");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
            User Dashboard
          </h1>
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="relative group cursor-pointer">
              <span className="text-2xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                Welcome, <span className="text-slate-900">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Subscriptions Card */}
          <section className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Your Subscriptions
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Receive alerts for your interests:
            </p>
            <div className="space-y-4 mb-8">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleSubscriptionChange(cat)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                    />
                    <svg
                      className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleSaveSubscriptions}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-50 transition-all active:scale-[0.98]"
            >
              Save Preferences
            </button>
          </section>

          {/* Feed Section */}
          <section className="lg:col-span-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              Live Feed
              {notifications.length > 0 && (
                <span className="text-[10px] uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ring-1 ring-indigo-200">
                  {notifications.length} Total
                </span>
              )}
            </h2>
            {/* <div className="space-y-4">
              {notifications?.data?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <span className="text-4xl mb-4 block">📭</span>
                  <p className="text-slate-500 font-medium">
                    No updates yet. Subscribe to start receiving alerts!
                  </p>
                </div>
              ) : (
                notifications?.map((n: IReceiptRes) => (
                  <div
                    key={n._id}
                    className={`group bg-white p-6 rounded-2xl border transition-all hover:shadow-md ${
                      n.isRead
                        ? "border-slate-100 opacity-75"
                        : "border-indigo-100 bg-indigo-50/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {n?.notificationId?.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {moment(n?.deliveredAt).fromNow()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {n?.notificationId?.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {n?.notificationId?.message}
                    </p>
                    {!n?.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4 decoration-indigo-200 transition-all"
                      >
                        <Check />
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div> */}
            <NotificationFeed notificationList={notifications} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
