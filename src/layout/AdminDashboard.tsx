import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { errorToast, successToast } from "../shared/CustomToast";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("System");
  const [status, setStatus] = useState("sent");
  const [loading, setLoading] = useState(false);

  const categories = ["System", "Task", "Announcement", "Update"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/notifications", { title, message, category, status });
      successToast("Notification sent successfully!");
      setTitle("");
      setMessage("");
    } catch (err) {
      errorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
            Admin Control Panel
          </h1>
          <div className="flex items-center gap-6">
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
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Send New Notification
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification Title"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all h-32 resize-none"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-white"
              >
                <option key={"sent"} value={"sent"}>
                  sent
                </option>
                <option key={"draft"} value={"draft"}>
                  draft
                </option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-[0.98]"
            >
              {loading ? "Sending..." : "Broadcast Notification"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
