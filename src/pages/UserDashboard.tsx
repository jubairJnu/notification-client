import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import NotificationFeed from "./NotificationFeed";
import { errorToast, successToast } from "../shared/CustomToast";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,

    updateSubscriptions,
    getSubscriptions,
    unSubscribe,
  } = useNotifications();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);

  const categories = ["System", "Task", "Announcement", "Update"];

  useEffect(() => {
    const fetchCurrentSubs = async () => {
      const subs = await getSubscriptions();

      setSelectedCategories(subs);
      setInitialCategories(subs);
    };
    fetchCurrentSubs();
  }, []);

  const handleSubscriptionChange = (category: string) => {
    const newSubs = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSubs);
  };

  const handleSaveSubscriptions = async () => {
    try {
      let res;
      const toSubscribe = selectedCategories.filter(
        (cat) => !initialCategories.includes(cat)
      );
      const toUnsubscribe = initialCategories.filter(
        (cat) => !selectedCategories.includes(cat)
      );

      if (toSubscribe.length > 0) {
        res = await updateSubscriptions(toSubscribe);
      }
      if (toUnsubscribe.length > 0) {
        res = await unSubscribe(toUnsubscribe);
      }

      setInitialCategories(selectedCategories);
      successToast();
    } catch (err) {
      errorToast(err);
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
          <section className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Your Subscriptions
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Receive alerts for your interests:
            </p>
            <div className="space-y-4 mb-8">
              {categories?.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories?.includes(cat)}
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

            <NotificationFeed notificationList={notifications} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
