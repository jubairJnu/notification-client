import { Settings } from "lucide-react";

const NotificvationSettings = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Subscriptions</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Choose which types of notifications you want to receive
      </p>

      <div className="space-y-3">
        {NOTIFICATION_CATEGORIES.map((category) => {
          const isSubscribed = subscriptions.includes(category.id);
          return (
            <div
              key={category.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSubscribed
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleSubscription(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="font-medium text-gray-700">
                    {category.name}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSubscribed
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSubscribed && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong className="text-gray-800">{subscriptions.length}</strong> of{" "}
          <strong className="text-gray-800">
            {NOTIFICATION_CATEGORIES.length}
          </strong>{" "}
          categories subscribed
        </p>
      </div>
    </div>
  );
};

export default NotificvationSettings;
