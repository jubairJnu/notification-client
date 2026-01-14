
import Navbar from "../shared/Navbar";
import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
